import { Injectable } from '@angular/core';
import { ChannelDoc, ChannelOrderDoc, EntryDoc } from './database.models';
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

  async entiresOrderedByDate(): Promise<EntryDoc[]> {
    const result = await this.databaseService.db.query(this.dbEntryMapFunc, {
      descending: true,
      include_docs: true,
      limit: 10,
    });

    return result.rows.map((row: any) => row.doc);
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

  private dbEntryMapFunc = (doc: any) => {
    if (doc.type === 'entry') {
      emit(doc.publishedAt);
    }
  };
}

// Pouchdb emit method
declare var emit: any;
