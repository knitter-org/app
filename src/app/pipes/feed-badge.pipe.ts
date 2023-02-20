import { Pipe, PipeTransform } from '@angular/core';
import { Entry } from 'app/services/database.models';
import { FeedsRepository } from 'app/state/feeds.store';
import { firstValueFrom } from 'rxjs';

@Pipe({
  name: 'feedBadge',
  standalone: true,
})
export class FeedBadgePipe implements PipeTransform {
  constructor(private feedsRepo: FeedsRepository) {}

  async transform(entry: Entry): Promise<string> {
    const { title, badge } = await firstValueFrom(this.feedsRepo.getFeed$(entry.feedId)) ?? {};
    return badge ?? title ?? 'error';
  }
}
