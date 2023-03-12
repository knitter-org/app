import { Injectable } from '@angular/core';
import { hashCode } from 'app/utils/string';
import { Doc, Entry, Feed } from './database.models.d';
import { DatabaseService } from './database.service';
import { FeedReaderService, FetchedEntry } from './feed-reader.service';

export interface FeedDoc extends Doc {
  title: string;
  badge?: string;
  url: string;
  fetch: {
    lastSuccessfulAt: string;
    intervalMinutes: number;
  };
  retention: RetentionKeepForever | RetentionDeleteOlderThan;
  entries: EntryDoc[];
}

export interface RetentionKeepForever {
  strategy: 'keep-forever';
}
export interface RetentionDeleteOlderThan {
  strategy: 'delete-older-than';
  thresholdHours: number;
}

export interface EntryDoc {
  id: string;
  title: string;
  text: string;
  publishedAt: string;
  readAt?: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class FeedService {
  static ID_PREFIX = 'feed:';

  constructor(
    private feedReaderService: FeedReaderService,
    private databaseService: DatabaseService
  ) {}

  async addFeed(
    title: string,
    url: string,
    fetchedAt: Date,
    entries: FetchedEntry[]
  ): Promise<Feed> {
    const feedId = FeedService.generateFeedId(url);

    const feedDoc: FeedDoc = {
      _id: feedId,
      type: 'feed',
      title,
      url,
      fetch: {
        lastSuccessfulAt: fetchedAt.toISOString(),
        intervalMinutes: 5,
      },
      retention: { strategy: 'keep-forever' },
      entries: entries.map((fetchedEntry) => this.mapToEntryDoc(fetchedEntry)),
    };
    this.updateFeedDocEntryOrder(feedDoc);

    const response = await this.databaseService.put(feedDoc);
    return await this.getFeed(response.id);
  }

  async saveFeed(feed: Feed): Promise<Feed> {
    if (!feed.badge || feed.badge.trim() === '') {
      feed.badge = undefined;
    }

    const feedDoc: FeedDoc = await this.databaseService.get(feed.id);

    const response = await this.databaseService.put(this.mapToFeedDoc(feed, feedDoc.entries));
    return await this.getFeed(response.id);
  }

  async deleteFeed(feed: Feed) {
    const feedDoc: FeedDoc = await this.databaseService.get(feed.id);
    await this.databaseService.db.remove(feedDoc._id, feedDoc._rev!);
  }

  async getEntries(feedId: string): Promise<Entry[]> {
    const feedDoc: FeedDoc = await this.databaseService.get(feedId);

    // Only a workaround to save a migration, can be removed soon, added 2023-02-22
    this.updateFeedDocEntryOrder(feedDoc);
    return feedDoc.entries.map(entryDoc => this.mapToEntry(entryDoc, feedDoc._id));
  }

  async fetchEntries(feedId: string) {
    const feedDoc = await this.databaseService.get<FeedDoc>(feedId);
    const fetchedAt = new Date();
    const fetchResult = await this.feedReaderService.fetchFeed(feedDoc.url);

    const newEntries = fetchResult.entries
      .filter((entry) => entry.publishedAt.toISOString() > feedDoc.fetch.lastSuccessfulAt)
      .map((fetchedEntry) => this.mapToEntryDoc(fetchedEntry));
    if (newEntries.length > 0) {
      feedDoc.entries = [...newEntries, ...feedDoc.entries];
      this.applyRetentionStrategy(feedDoc);
      this.updateFeedDocEntryOrder(feedDoc);
      console.log(
        `Fetch finished for ${feedDoc._id} (${feedDoc.title}): ${newEntries.length} new entries since ${feedDoc.fetch.lastSuccessfulAt}`
      );
    } else {
      console.log(
        `Fetch finished for ${feedDoc._id} (${feedDoc.title}): No updates since ${feedDoc.fetch.lastSuccessfulAt}`
      );
    }

    feedDoc.fetch.lastSuccessfulAt = fetchedAt.toISOString();

    const response = await this.databaseService.put(feedDoc);
    return await this.getFeed(response.id);
  }

  async markEntryAsRead(feedId: string, entryId: string, isRead: boolean = true): Promise<Entry> {
    const feedDoc: FeedDoc = await this.databaseService.db.get(feedId);
    feedDoc.entries = feedDoc.entries.map(entryDoc => {
      if (entryDoc.id === entryId) {
        let readAt: string | undefined;
        if (isRead) {
          readAt = entryDoc.readAt ?? new Date().toISOString();
        } else {
          readAt = undefined;
        }
        return {
          ...entryDoc,
          readAt,
        };
      }
      return entryDoc;
    });
    await this.databaseService.put(feedDoc);

    const entryDoc = feedDoc.entries.find(it => it.id === entryId);
    return this.mapToEntry(entryDoc!, feedDoc._id);
  }

  async getFeeds(): Promise<Feed[]> {
    const result = await this.databaseService.db.allDocs({
      include_docs: true,
      startkey: FeedService.ID_PREFIX,
      endkey: FeedService.ID_PREFIX + '\ufff0',
    });
    return result.rows.map(row => this.mapToFeed(row.doc as FeedDoc));
  }

  async getFeed(feedId: string): Promise<Feed> {
    const feedDoc: FeedDoc = await this.databaseService.db.get(feedId);
    return this.mapToFeed(feedDoc);
  }

  async getUnreadEntryCountForFeedId(feedId: string): Promise<number> {
    const feedDoc: FeedDoc = await this.databaseService.db.get(feedId);
    return feedDoc.entries.filter(entryDoc => !entryDoc.readAt).length;
  }

  private mapToFeed(doc: FeedDoc): Feed {
    return {
      ...doc,
      id: doc._id,
      rev: doc._rev!,
      fetch: {
        ...doc.fetch,
        lastSuccessfulAt: new Date(doc.fetch.lastSuccessfulAt),
      }
    };
  }

  private mapToFeedDoc(feed: Feed, entries: FeedDoc['entries']): FeedDoc {
    return {
      ...feed,
      _id: feed.id,
      _rev: feed.rev,
      type: 'feed',
      fetch: {
        ...feed.fetch,
        lastSuccessfulAt: feed.fetch.lastSuccessfulAt.toISOString(),
      },
      entries
    };
  }

  private mapToEntry(entry: EntryDoc, feedId: string): Entry {
    let id = entry.id;
    // Only a workaround to save a migration, can be removed soon, added 2023-02-22
    if (!id) {
      id = this.generateEntryId(entry.url, new Date(entry.publishedAt));
    }
    return {
      ...entry,
      id,
      feedId,
      publishedAt: new Date(entry.publishedAt),
      readAt: entry.readAt ? new Date(entry.readAt) : undefined,
    };
  }

  private mapToEntryDoc(fetched: FetchedEntry): EntryDoc {
    return {
      ...fetched,
      id: this.generateEntryId(fetched.url, fetched.publishedAt),
      publishedAt: fetched.publishedAt.toISOString(),
    };
  }

  static generateFeedId(url: string): string {
    const hostname = new URL(url).hostname;
    const hash = Math.abs(hashCode(url)).toString(36);
    return `${FeedService.ID_PREFIX}${hostname}-${hash}`;
  }

  private generateEntryId(url: string, publishedAt: Date): string {
    const urlHash = Math.abs(hashCode(url)).toString(36);
    const dateHash = Math.abs(hashCode(publishedAt.toISOString())).toString(36);
    return `${urlHash}${dateHash}`;
  }

  private updateFeedDocEntryOrder(feedDoc: FeedDoc) {
    feedDoc.entries.sort(
      (a, b) => a.publishedAt == b.publishedAt ? 0 : (a.publishedAt < b.publishedAt ? 1 : -1)
    );
  }

  private applyRetentionStrategy(feedDoc: FeedDoc) {
    if (feedDoc.retention.strategy === 'delete-older-than') {
      const thresholdDate = new Date(new Date().getTime() - feedDoc.retention.thresholdHours * 60 * 60 * 1000).toISOString();
      feedDoc.entries = feedDoc.entries.filter(entry => entry.publishedAt > thresholdDate);
    }
  }
}
