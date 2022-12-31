import { Injectable } from '@angular/core';
import { DatabaseService } from '../database.service';

@Injectable({
  providedIn: 'root'
})
export class InitializationService {

  constructor(
    private databaseService: DatabaseService
  ) { }

  async isInitialized(): Promise<boolean> {
    const info = await this.databaseService.db.info();
    console.log(info);
    return info.doc_count > 0;
  }

  async initialize() {
    await this.databaseService.db.post({
      type: 'channel',
      title: 'Timeline',
    });
  }
}
