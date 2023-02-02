import { Pipe, PipeTransform } from '@angular/core';
import { Entry } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';

@Pipe({
  name: 'feedBadge'
})
export class FeedBadgePipe implements PipeTransform {
  constructor(
    private feedService: FeedService
  ) {}

  async transform(entry: Entry): Promise<string> {
    return Promise.resolve('not implemented');
    // const feedId = this.entryService.getFeedIdForEntryId(entry._id);
    // const feed = await this.feedService.getFeed(feedId);
    // return feed.badge ?? feed.title;
  }
}
