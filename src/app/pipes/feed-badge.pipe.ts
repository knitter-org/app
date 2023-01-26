import { Pipe, PipeTransform } from '@angular/core';
import { EntryDoc } from 'app/services/database.models';
import { EntryService } from 'app/services/entry.service';
import { FeedService } from 'app/services/feed.service';

@Pipe({
  name: 'feedBadge'
})
export class FeedBadgePipe implements PipeTransform {
  constructor(
    private entryService: EntryService,
    private feedService: FeedService
  ) {}

  async transform(entryDoc: EntryDoc): Promise<string> {
    const feedId = this.entryService.getFeedIdForEntryId(entryDoc._id);
    const feed = await this.feedService.getFeed(feedId);
    return feed.badge ?? feed.title;
  }
}
