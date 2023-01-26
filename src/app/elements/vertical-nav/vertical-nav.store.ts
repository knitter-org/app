import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { ChannelService } from 'app/services/channel.service';
import { ChannelDoc, FeedDoc } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';

export interface FeedStatus {
  unreadEntriesCount?: number;
  isLoading: boolean;
}

export interface State {
  channels: ChannelDoc[];
  isChannelsLoading: boolean;
  feedsAndStatus: { feed: FeedDoc; status: FeedStatus }[];
  isFeedsLoading: boolean;
}

@Injectable()
export class VerticalNavStore extends ComponentStore<State> {
  constructor(
    private channelService: ChannelService,
    private feedService: FeedService
  ) {
    super({
      channels: [],
      feedsAndStatus: [],
      isChannelsLoading: false,
      isFeedsLoading: false,
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

  readonly fetchFeeds = this.effect((trigger$: Observable<void>) =>
    trigger$.pipe(
      tap((_) => this.patchState({ isFeedsLoading: true })),
      switchMap((_) => this.feedService.getFeeds()),
      tapResponse(
        (feeds) =>
          this.patchState({
            feedsAndStatus: this.mapFeedsToFeedsAndStatus(feeds),
            isFeedsLoading: false,
          }),
        (error) => console.log('ChannelViewStore error:', error)
      )
    )
  );

  mapFeedsToFeedsAndStatus(feeds: FeedDoc[]): { feed: FeedDoc; status: FeedStatus; }[] {
    return feeds.map(feed => ({
      feed,
      status: { isLoading: false },
    }))
  }
}
