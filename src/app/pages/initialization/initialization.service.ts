import { Injectable } from '@angular/core';
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
    await this.databaseService.db.put({
      _id: 'channel:timeline',
      title: 'Timeline',
    });
    await this.databaseService.db.put({
      _id: 'channels',
      order: ['channel:timeline'],
    });
  }
}