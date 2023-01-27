import { Injectable } from '@angular/core';
import { EntryDoc, FeedDoc } from './database.models';
import { DatabaseService } from './database.service';
import { hashCode } from 'app/utils/string';
import { FeedService } from './feed.service';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  static ID_PREFIX = 'entry:';

  constructor(private databaseService: DatabaseService) {}

  async addEntries(
    entries: Omit<EntryDoc, '_id' | 'type'>[],
    feedDoc: FeedDoc
  ): Promise<string[]> {
    const docs = entries.map(entry => {
      const entryId = this.generateEntryId(feedDoc, entry.publishedAt, entry.url);
      const entryDoc: EntryDoc = {
        _id: entryId,
        type: 'entry',
        title: entry.title,
        text: entry.text,
        url: entry.url,
        publishedAt: entry.publishedAt,
      };
      return entryDoc;
    });

    const results = await this.databaseService.db.bulkDocs(docs);
    return results.map(result => result.id!);
  }

  async entriesForFeed(feedId: string): Promise<EntryDoc[]> {
    const feedPart = feedId.substring(feedId.indexOf(':') + 1);
    const result = await this.databaseService.db.allDocs({
      include_docs: true,
      descending: true,
      startkey: EntryService.ID_PREFIX + feedPart + '\ufff0',
      endkey: EntryService.ID_PREFIX + feedPart,
    });
    return result.rows.map((row: any) => row.doc);
  }

  async markEntryAsRead(entry: EntryDoc): Promise<EntryDoc> {
    if (!entry.readAt) {
      const copy = {
        ...entry,
        readAt: new Date()
      };
      copy._rev = (await this.databaseService.db.put(copy)).rev;
      return copy;
    }
    return entry;
  }

  getFeedIdForEntryId(entryId: string): string {
    const feedPart = entryId.substring(entryId.indexOf(':') + 1, entryId.indexOf('/'));
    return `${FeedService.ID_PREFIX}${feedPart}`;
  }

  generateEntryId(feedDoc: FeedDoc, publishedAt: Date, url: string): string {
    const feedPart = feedDoc._id.substring(feedDoc._id.indexOf(':') + 1);
    const datePart = publishedAt.toISOString().substring(0, 19);
    const hash = Math.abs(hashCode(url)).toString(36);
    return `${EntryService.ID_PREFIX}${feedPart}/${datePart}-${hash}`;
  }
}
