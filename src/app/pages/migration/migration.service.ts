import { Injectable } from '@angular/core';
import { DatabaseInfoDoc, FeedDoc } from 'app/services/database.models';
import { DatabaseService } from 'app/services/database.service';
import { FeedService } from 'app/services/feed.service';
import { rangeEndInclusive } from 'app/utils/range';

@Injectable({
  providedIn: 'root',
})
export class MigrationService {
  public readonly TARGET_SCHEMA_VERSION = 2;
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
    const migrationSteps = rangeEndInclusive(
      currentVersion,
      this.TARGET_SCHEMA_VERSION
    );
    for (let migrationStep of migrationSteps) {
      console.log('Migrate database schema to version', migrationStep);
      switch (migrationStep) {
        case 1:
          await this.migrateTo1();
          break;
        case 2:
          await this.migrateTo2();
          break;
        default:
          throw new Error(`Migration step ${migrationStep} not implmemented!`);
      }

      await this.updateSchemaVersionTo(migrationStep);
    }

    console.log('Database migration finished');
  }

  private async updateSchemaVersionTo(newSchemaVersion: number) {
    let dbInfoDoc: DatabaseInfoDoc | null = null;
    try {
      dbInfoDoc = await this.databaseService.db.get(this.DATABASE_INFO_DOC_ID);
      dbInfoDoc.schemaVersion = newSchemaVersion;
    } catch {
      dbInfoDoc = {
        _id: 'database-info',
        type: 'database-info',
        schemaVersion: newSchemaVersion,
      };
    }
    await this.databaseService.db.put(dbInfoDoc);
  }

  /** Add new fields to all feed docs: fetch.intervalMinutes, retention */
  private async migrateTo1() {
    const result = await this.databaseService.db.allDocs({
      include_docs: true,
      startkey: FeedService.ID_PREFIX,
      endkey: FeedService.ID_PREFIX + '\ufff0',
    });
    for (let feedDoc of result.rows.map(
      (row) => row.doc as unknown as FeedDoc
    )) {
      feedDoc.fetch.intervalMinutes = 5;
      feedDoc.retention = { strategy: 'keep-forever' };
      await this.databaseService.db.put(feedDoc);
    }
  }

  /** Add index docs: _design/channel-entries and _design/entries */
  private async migrateTo2() {
    try {
      const doc = await this.databaseService.db.get('_design/channel-entries');
      await this.databaseService.db.remove(doc);
    } catch {}

    const channelEntriesDoc = {
      _id: '_design/channel-entries',
      views: {
        timeline: {
          map: function (doc: FeedDoc) {
            if (doc.type === 'feed') {
              for (let entry of doc.entries) {
                if (!entry.readAt) {
                  emit(entry.publishedAt, entry);
                }
              }
            }
          }.toString(),
        },
      },
    };
    await this.databaseService.db.put(channelEntriesDoc);

    try {
      const doc = await this.databaseService.db.get('_design/entries');
      await this.databaseService.db.remove(doc);
    } catch {}

    const entriesDoc = {
      _id: '_design/entries',
      views: {
        entryIdToFeedInfo: {
          map: function (doc: FeedDoc) {
            if (doc.type === 'feed') {
              for (let entry of doc.entries) {
                emit(entry.id, [doc.title, doc.badge]);
              }
            }
          }.toString(),
        },
        unreadEntries: {
          map: function (doc: FeedDoc) {
            if (doc.type === 'feed') {
              const unreadCount = doc.entries.filter(entry => !entry.readAt).length;
              emit(doc._id, unreadCount);
            }
          }.toString(),
        },
      },
    };
    await this.databaseService.db.put(entriesDoc);
  }
}

// Pouchdb emit method
declare var emit: any;
