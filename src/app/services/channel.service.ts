import { Injectable } from '@angular/core';
import { ChannelDoc, ChannelOrderDoc, Entry } from './database.models';
import { DatabaseService } from './database.service';
import { FeedService } from './feed.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  static ID_PREFIX = 'channel:';
  static ORDER_DOC_ID = 'channels';

  constructor(
    private feedService: FeedService,
    private databaseService: DatabaseService
  ) {}

  async unreadEntiresOrderedByDate(channelId: string): Promise<Entry[]> {
    let feedIds: string[] = [];
    if (channelId === ChannelService.ID_PREFIX + 'timeline') {
      feedIds = (await this.feedService.getFeeds()).map(feed => feed.id);
    } else {
      throw 'not implemented';
    }

    const feedEntries: Entry[][] = await Promise.all(feedIds.map(feedId => this.feedService.getEntries(feedId)));
    return this.sortEntries(feedEntries.flatMap(entries => entries).filter(entry => !entry.readAt));
  }

  async getChannel(channelId: string): Promise<ChannelDoc> {
    return this.databaseService.db.get(channelId);
  }

  async getAllChannelsSorted(): Promise<ChannelDoc[]> {
    const orderDoc: ChannelOrderDoc = await this.databaseService.db.get(ChannelService.ORDER_DOC_ID);
    const allDocs = await this.databaseService.db.allDocs({
      keys: orderDoc.order,
      include_docs: true,
    });
    return allDocs.rows.map(row => row.doc! as unknown as ChannelDoc);
  }

  private sortEntries(entries: Entry[]): Entry[] {
    return [...entries].sort(
      (a, b) => a.publishedAt == b.publishedAt ? 0 : (a.publishedAt < b.publishedAt ? 1 : -1)
    );
  }
}
