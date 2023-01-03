import { Injectable } from '@angular/core';
import { EntryDoc, FeedDoc } from './database.models';
import { DatabaseService } from './database.service';
import { hashCode } from './utils/string';

@Injectable({
  providedIn: 'root',
})
export class EntryService {
  static ID_PREFIX = 'entry:';

  constructor(private databaseService: DatabaseService) {}

  async addEntries(
    entries: { title: string; text: string; publishedAt: Date; url: string }[],
    feedDoc: FeedDoc
  ) {
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

    const r = await this.databaseService.db.bulkDocs(docs);
    console.log('entries:', r);
  }

  async entriesForFeed(feedId: string): Promise<EntryDoc[]> {
    const feedPart = feedId.substring(feedId.indexOf(':'));
    const result = await this.databaseService.db.allDocs({
      include_docs: true,
      startkey: EntryService.ID_PREFIX + feedPart,
      endkey: EntryService.ID_PREFIX + feedPart + '\ufff0',
    });
    return result.rows.map((row: any) => row.doc);
  }
  
  generateEntryId(feedDoc: FeedDoc, publishedAt: Date, url: string): string {
    const feedPart = feedDoc._id.substring(feedDoc._id.indexOf(':'));
    const datePart = publishedAt.toISOString().substring(0, 19);
    const hash = hashCode(url).toString(36);
    return `${EntryService.ID_PREFIX}${feedPart}/${datePart}-${hash}`;
  }
}
