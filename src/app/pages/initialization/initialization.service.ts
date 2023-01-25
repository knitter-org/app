import { Injectable } from '@angular/core';
import { ChannelService } from 'app/channel.service';
import { ChannelDoc, ChannelOrderDoc, DatabaseInfoDoc } from 'app/database.models';
import { DatabaseService } from '../../database.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(
    private databaseService: DatabaseService
  ) {}

  async isInitialized(): Promise<boolean> {
    const info = await this.databaseService.db.info();
    return info.update_seq > 0;
  }

  async initialize() {
    await this.initializeChannels();
    // await this.initializeDatabaseInfo();
  }

  private async initializeChannels() {
    const timelineChannelDoc: ChannelDoc = {
      _id: 'channel:timeline',
      type: 'channel',
      title: 'Timeline',
    };
    await this.databaseService.db.put(timelineChannelDoc);

    const channelOrderDoc: ChannelOrderDoc = {
      _id: ChannelService.ORDER_DOC_ID,
      type: 'channel',
      order: ['channel:timeline'],
    };
    await this.databaseService.db.put(channelOrderDoc);
  }

  private async initializeDatabaseInfo() {
    const dbInfoDoc: DatabaseInfoDoc = {
      _id: 'database-info',
      type: 'database-info',
      schemaVersion: 1,
    };
    await this.databaseService.db.put(dbInfoDoc);
  }
}
