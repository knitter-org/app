import { Injectable } from '@angular/core';
import { FeedService } from 'app/services/feed.service';
import { FeedsRepository } from 'app/state/feeds.store';
import { forkJoin, Observable, switchMap } from 'rxjs';

interface FeedVm {
  id: string;
  title: string;
  unreadEntriesCount: number;
}

@Injectable()
export class VerticalNavRepository {
  constructor(
    private feedsRepo: FeedsRepository,
    private feedService: FeedService
  ) {}

  feedVms$(): Observable<FeedVm[]> {
    return this.feedsRepo.feeds$.pipe(
      switchMap((feeds) =>
        forkJoin(
          feeds.map((feed) =>
            this.feedService
              .getUnreadEntryCountForFeedId(feed.id)
              .then((unreadEntriesCount) => ({
                id: feed.id,
                title: feed.title,
                unreadEntriesCount,
              }))
          )
        )
      )
    );
  }
}
