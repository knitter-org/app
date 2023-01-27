import { Injectable } from '@angular/core';
import { FeedDoc } from './database.models';
import { DatabaseService } from './database.service';
import { EntryService } from './entry.service';
import { FeedReaderService } from './feed-reader.service';
import { hashCode } from 'app/utils/string';

@Injectable({
  providedIn: 'root'
})
export class FeedService {
  static ID_PREFIX = 'feed:';

  constructor(
    private feedReaderService: FeedReaderService,
    private databaseService: DatabaseService,
    private entryService: EntryService
  ) { }

  async addFeed(url: string): Promise<string> {
    const fetchedAt = new Date();
    const fetchResult = await this.feedReaderService.fetchFeed(url);
    const feedId = this.generateFeedId(url);

    const feedDoc: FeedDoc = {
      _id: feedId,
      type: 'feed',
      title: fetchResult.title,
      url: url,
      fetch: {
        lastSuccessfulAt: fetchedAt,
        intervalMinutes: 5,
      },
      retention: { strategy: 'keep-forever' },
    };

    await this.saveFeed(feedDoc);
    await this.entryService.addEntries(fetchResult.entries, feedDoc);

    return feedId;
  }

  async saveFeed(feedDoc: FeedDoc): Promise<void> {
    if (!feedDoc.badge || feedDoc.badge.trim() === '') {
      feedDoc.badge = undefined;
    }
    await this.databaseService.put(feedDoc);
  }

  async fetchEntries(feedId: string) {
    const feed = await this.getFeed(feedId);
    const fetchedAt = new Date();
    const fetchResult = await this.feedReaderService.fetchFeed(feed.url);

    const newEntries = fetchResult.entries.filter(entry => entry.publishedAt > feed.fetch.lastSuccessfulAt);
    if (newEntries.length > 0) {
      await this.entryService.addEntries(newEntries, feed);
      console.log(`Fetch finished for ${feed._id} (${feed.title}): ${newEntries.length} new entries since ${feed.fetch.lastSuccessfulAt}`);
    } else {
      console.log(`Fetch finished for ${feed._id} (${feed.title}): No updates since ${feed.fetch.lastSuccessfulAt}`);
    }

    feed.fetch.lastSuccessfulAt = fetchedAt;
    await this.databaseService.put(feed);
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

  private mapToFeedDoc(doc: any): FeedDoc {
    doc.fetch.lastSuccessfulAt = new Date(doc.fetch.lastSuccessfulAt);
    return doc as FeedDoc;
  }

  private generateFeedId(url: string): string {
    const hostname = new URL(url).hostname;
    const hash = Math.abs(hashCode(url)).toString(36);
    return `${FeedService.ID_PREFIX}${hostname}-${hash}`;
  }
}