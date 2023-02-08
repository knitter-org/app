import { Pipe, PipeTransform } from '@angular/core';
import { Entry } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';

@Pipe({
  name: 'feedBadge',
})
export class FeedBadgePipe implements PipeTransform {
  constructor(private feedService: FeedService) {}

  async transform(entry: Entry): Promise<string> {
    const { title, badge } = await this.feedService.getFeedTitleAndBadgeByEntry(
      entry
    );
    return badge ?? title;
  }
}
