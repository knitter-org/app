import { Injectable } from '@angular/core';
import { ChannelDoc, ChannelOrderDoc, Entry, FeedDoc } from './database.models';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  static ID_PREFIX = 'channel:';
  static ORDER_DOC_ID = 'channels';

  constructor(
    private databaseService: DatabaseService
  ) {}

  async unreadEntiresOrderedByDate(_channelId: string): Promise<Entry[]> {
    const result = await this.databaseService.db.query(this.dbUnreadEntryMapFunc, {
      descending: true,
      limit: 20,
    });

    return result.rows.map((row) => row.value);
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

  private dbUnreadEntryMapFunc = (doc: FeedDoc) => {
    if (doc.type === 'feed') {
      for (let entry of doc.entries) {
        if (!entry.readAt) {
          emit([entry.publishedAt, entry.id], entry);
        }
      }
    }
  };
}

// Pouchdb emit method
declare var emit: any;
