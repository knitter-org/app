import { Injectable } from '@angular/core';
import { hashCode } from 'app/utils/string';
import { Entry, FeedDoc } from './database.models';
import { DatabaseService } from './database.service';
import { FeedReaderService, FetchedEntry } from './feed-reader.service';

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
  ): Promise<FeedDoc> {
    const feedId = this.generateFeedId(url);

    const feedDoc: FeedDoc = {
      _id: feedId,
      type: 'feed',
      title,
      url,
      fetch: {
        lastSuccessfulAt: fetchedAt,
        intervalMinutes: 5,
      },
      retention: { strategy: 'keep-forever' },
      entries: entries.map((fetchedEntry) => this.mapToEntry(fetchedEntry)),
    };

    await this.saveFeed(feedDoc);
    return await this.getFeed(feedId);
  }

  async saveFeed(feedDoc: FeedDoc): Promise<FeedDoc> {
    if (!feedDoc.badge || feedDoc.badge.trim() === '') {
      feedDoc.badge = undefined;
    }

    this.updateFeedEntryOrder(feedDoc);

    const response = await this.databaseService.put(feedDoc);
    return await this.getFeed(response.id);
  }

  async fetchEntries(feedId: string) {
    const feedDoc = await this.getFeed(feedId);
    const fetchedAt = new Date();
    const fetchResult = await this.feedReaderService.fetchFeed(feedDoc.url);

    const newEntries = fetchResult.entries
      .filter((entry) => entry.publishedAt > feedDoc.fetch.lastSuccessfulAt)
      .map((fetchedEntry) => this.mapToEntry(fetchedEntry));
    if (newEntries.length > 0) {
      feedDoc.entries = [...newEntries, ...feedDoc.entries];
      console.log(
        `Fetch finished for ${feedDoc._id} (${feedDoc.title}): ${newEntries.length} new entries since ${feedDoc.fetch.lastSuccessfulAt}`
      );
    } else {
      console.log(
        `Fetch finished for ${feedDoc._id} (${feedDoc.title}): No updates since ${feedDoc.fetch.lastSuccessfulAt}`
      );
    }

    feedDoc.fetch.lastSuccessfulAt = fetchedAt;
    return await this.saveFeed(feedDoc);
  }

  async getFeeds(): Promise<FeedDoc[]> {
    const result = await this.databaseService.db.allDocs({
      include_docs: true,
      startkey: FeedService.ID_PREFIX,
      endkey: FeedService.ID_PREFIX + '\ufff0',
    });
    return result.rows.map((row: any) => this.mapToFeedDoc(row.doc));
  }

  async getFeed(feedId: string): Promise<FeedDoc> {
    const feed: FeedDoc = await this.databaseService.db.get(feedId);
    return this.mapToFeedDoc(feed);
  }

  async getUnreadEntryCountForFeedId(feedId: string): Promise<number> {
    const response = await this.databaseService.db.query(
      'entries/unreadEntries',
      {
        startkey: feedId,
        limit: 1,
      }
    );
    return response.rows[0].value;
  }

  async getFeedTitleAndBadgeByEntry(
    entry: Entry
  ): Promise<{ title: string; badge?: string }> {
    const response = await this.databaseService.db.query(
      'entries/entryIdToFeedInfo',
      {
        startkey: entry.id,
        limit: 1,
      }
    );
    const [title, badge] = response.rows[0].value;
    return { title, badge };
  }

  private mapToFeedDoc(doc: any): FeedDoc {
    doc.fetch.lastSuccessfulAt = new Date(doc.fetch.lastSuccessfulAt);
    doc.entries = doc.entries.map((entry: any) => this.mapToFeedEntry(entry));
    return doc as FeedDoc;
  }

  private mapToFeedEntry(entry: Entry): Entry {
    entry.publishedAt = new Date(entry.publishedAt);
    entry.readAt = entry.readAt ? new Date(entry.readAt) : undefined;
    return entry;
  }

  private mapToEntry(fetched: FetchedEntry): Entry {
    const entry: Entry = {
      ...fetched,
      id: this.generateEntryId(fetched.url, fetched.publishedAt),
    };
    return entry;
  }

  private generateFeedId(url: string): string {
    const hostname = new URL(url).hostname;
    const hash = Math.abs(hashCode(url)).toString(36);
    return `${FeedService.ID_PREFIX}${hostname}-${hash}`;
  }

  private generateEntryId(url: string, publishedAt: Date): string {
    const urlHash = Math.abs(hashCode(url)).toString(36);
    const dateHash = Math.abs(hashCode(publishedAt.toISOString())).toString(36);
    return `${urlHash}${dateHash}`;
  }

  private updateFeedEntryOrder(feedDoc: FeedDoc) {
    feedDoc.entries.sort(
      (a, b) => b.publishedAt.getTime() - a.publishedAt.getTime()
    );
  }
}
