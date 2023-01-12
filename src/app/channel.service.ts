import { Injectable } from '@angular/core';
import { ChannelDoc, EntryDoc } from './database.models';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class ChannelService {
  static ID_PREFIX = 'channel:';

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

  private dbEntryMapFunc = (doc: any) => {
    if (doc.type === 'entry') {
      emit(doc.publishedAt);
    }
  };
}

declare var emit: any;
