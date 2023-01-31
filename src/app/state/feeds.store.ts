import { Injectable } from '@angular/core';
import {
  ComponentStore,
  OnStateInit,
  tapResponse
} from '@ngrx/component-store';
import { FeedDoc } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { docsToIdMap } from 'app/utils/collections';
import { Map } from 'immutable';
import { Observable, switchMap } from 'rxjs';

export interface FeedsState {
  feedsIdMap: Map<string, FeedDoc>;
}

@Injectable()
export class FeedsStore
  extends ComponentStore<FeedsState>
  implements OnStateInit
{
  constructor(private feedService: FeedService) {
    super({
      feedsIdMap: Map(),
    });
  }

  ngrxOnStateInit() {
    this.popoulateFeedsIdMap();
  }

  readonly feeds$ = this.select((state) => [...state.feedsIdMap.values()]);

  readonly feedById$ = (feedId: string) =>
    this.select((state) => state.feedsIdMap.get(feedId));

  readonly updateFeed = this.effect((trigger$: Observable<FeedDoc>) =>
    trigger$.pipe(
      switchMap((feedDoc) => this.feedService.saveFeed(feedDoc)),
      tapResponse(
        (feedDoc) =>
          this.patchState((state) => ({
            feedsIdMap: state.feedsIdMap.set(feedDoc._id, feedDoc),
          })),
        (error) => console.log('FeedsStore updateFeed error:', error)
      )
    )
  );

  readonly popoulateFeedsIdMap = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      switchMap((_) => this.feedService.getFeeds()),
      tapResponse(
        (feeds) => this.patchState({ feedsIdMap: docsToIdMap(feeds) }),
        (error) => console.log('FeedsStore fetchFeeds error:', error)
      )
    )
  );
}
