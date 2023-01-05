import { Injectable } from '@angular/core';
import { defer } from 'rxjs';
import { FeedDoc } from './database.models';
import { DatabaseService } from './database.service';
import { EntryService } from './entry.service';
import { FeedReaderService } from './feed-reader.service';
import { hashCode } from './utils/string';

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
      fetch: { lastSuccessfulAt: fetchedAt },
    };

    await this.databaseService.put(feedDoc);
    await this.entryService.addEntries(fetchResult.entries, feedDoc);

    return feedId;
  }

  async fetchEntries(feedId: string) {
    const feed = await this.getFeed(feedId);
    const fetchedAt = new Date();
    const fetchResult = await this.feedReaderService.fetchFeed(feed.url);

    const newEntries = fetchResult.entries.filter(entry => entry.publishedAt > feed.fetch.lastSuccessfulAt);
    await this.entryService.addEntries(newEntries, feed);
    console.log(`Fetch finished for ${feed._id} (${feed.title}): ${newEntries.length} new entries since ${feed.fetch.lastSuccessfulAt}`);

    feed.fetch.lastSuccessfulAt = fetchedAt;
    await this.databaseService.put(feed);
  }

  async getFeeds(): Promise<FeedDoc[]> {
    const result = await this.databaseService.db.allDocs({
      include_docs: true,
      startkey: FeedService.ID_PREFIX,
      endkey: FeedService.ID_PREFIX + '\ufff0',
    });
    return result.rows.map((row: any) => row.doc);
  }

  async getFeed(feedId: string): Promise<FeedDoc> {
    return this.databaseService.db.get(feedId);
  }

  generateFeedId(url: string): string {
    const hostname = new URL(url).hostname;
    const hash = hashCode(url).toString(36);
    return `${FeedService.ID_PREFIX}${hostname}-${hash}`;
  }
}
