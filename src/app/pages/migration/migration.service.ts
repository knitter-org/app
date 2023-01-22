import { Injectable } from '@angular/core';
import { DatabaseInfoDoc } from 'app/database.models';
import { DatabaseService } from 'app/database.service';
import { FeedService } from 'app/feed.service';
import { rangeInclusive } from 'app/utils/range';

@Injectable({
  providedIn: 'root'
})
export class MigrationService {
  public readonly TARGET_SCHEMA_VERSION = 1;
  private readonly DATABASE_INFO_DOC_ID = 'database-info';

  constructor(private databaseService: DatabaseService) {}

  async currentSchemaVersion(): Promise<number> {
    let dbInfoDoc: DatabaseInfoDoc | null = null;
    try {
      dbInfoDoc = await this.databaseService.db.get(this.DATABASE_INFO_DOC_ID);
    } catch {}
    return dbInfoDoc?.schemaVersion || 0;
  }

  async needsMigration(): Promise<boolean> {
    const currentVersion = await this.currentSchemaVersion();
    return currentVersion != this.TARGET_SCHEMA_VERSION;
  }

  async migrate() {
    const currentVersion = await this.currentSchemaVersion();
    const migrationSteps = rangeInclusive(currentVersion+1, this.TARGET_SCHEMA_VERSION);
    for (let migrationStep of migrationSteps) {
      console.log('Migrate database schema to version', migrationStep);
      switch (migrationStep) {
        case 1: await this.migrateTo1(); break;
        default:
          throw new Error(`Migration step ${migrationStep} not implmemented!`);
      }

      await this.updateSchemaVersionTo(migrationStep);
    }

    console.log('Database migration finsihed');
  }

  private async updateSchemaVersionTo(newSchemaVersion: number) {
    let dbInfoDoc: DatabaseInfoDoc | null = null;
    try {
      dbInfoDoc = await this.databaseService.db.get(this.DATABASE_INFO_DOC_ID);
    } catch {
      dbInfoDoc = {
        _id: 'database-info',
        type: 'database-info',
        schemaVersion: newSchemaVersion,
      }
    }
    await this.databaseService.db.put(dbInfoDoc);
  }

  /** Add new fields to all feed docs: fetch.intervalMinutes, retention  */
  private async migrateTo1() {
    const result = await this.databaseService.db.allDocs({
      include_docs: true,
      startkey: FeedService.ID_PREFIX,
      endkey: FeedService.ID_PREFIX + '\ufff0',
    });
    for (let feedDoc of result.rows.map((row: any) => row.doc)) {
      feedDoc.fetch.intervalMinutes = 5;
      feedDoc.retention = { strategy: 'keep-forever' };
      await this.databaseService.db.put(feedDoc);
    }
  }
}
