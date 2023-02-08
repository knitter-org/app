import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ChannelService } from 'app/services/channel.service';
import { ChannelDoc } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { FeedsStore } from 'app/state/feeds.store';
import { map, Observable, switchMap, tap, forkJoin } from 'rxjs';

export interface FeedViewModel {
  _id: string;
  title: string;
  unreadEntriesCount: number;
}

export interface State {
  channels: ChannelDoc[];
  feedIdToUnreadEntryCount: Map<string, number>;
  isChannelsLoading: boolean;
}

@Injectable()
export class VerticalNavStore extends ComponentStore<State> {
  feedsVm$: Observable<FeedViewModel[]> = this.feedStore.feeds$.pipe(
    map((feeds) =>
      feeds.map((feedDoc) => ({ _id: feedDoc._id, title: feedDoc.title }))
    ),
    switchMap((feedVms) =>
      forkJoin(
        feedVms.map((feedVm) =>
          this.feedService
            .getUnreadEntryCountForFeedId(feedVm._id)
            .then((unreadEntriesCount) => ({ ...feedVm, unreadEntriesCount }))
        )
      )
    ),
  );

  constructor(
    private channelService: ChannelService,
    private feedService: FeedService,
    private feedStore: FeedsStore
  ) {
    super({
      channels: [],
      feedIdToUnreadEntryCount: new Map(),
      isChannelsLoading: false,
    });
  }

  readonly fetchChannels = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap((_) => this.patchState({ isChannelsLoading: true })),
      switchMap((_) => this.channelService.getAllChannelsSorted()),
      tapResponse(
        (channels) =>
          this.patchState({
            channels,
            isChannelsLoading: false,
          }),
        (error) => console.log('ChannelViewStore error:', error)
      )
    )
  );
}
