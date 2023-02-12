import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ChannelService } from 'app/services/channel.service';
import { ChannelDoc, Entry } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { concatMap, forkJoin, Observable, of, switchMap, tap, throwError } from 'rxjs';
import Immutable from 'immutable';

export interface ChannelViewState {
  channel?: ChannelDoc;
  entries?: Immutable.List<Entry>;
  isLoading: boolean;
}

@Injectable()
export class ChannelViewStore extends ComponentStore<ChannelViewState> {
  constructor(private channelService: ChannelService, private feedService: FeedService) {
    super({ isLoading: false });
  }

  readonly updateForChannelId = this.effect((channelId$: Observable<string>) =>
    channelId$.pipe(
      tap((_) => this.patchState({ isLoading: true })),
      switchMap((channelId) =>
        forkJoin({
          channel: this.channelService.getChannel(
            ChannelService.ID_PREFIX + channelId
          ),
          entries: this.channelService.unreadEntiresOrderedByDate(channelId),
        })
      ),
      tapResponse(
        ({ channel, entries }) =>
          this.patchState({
            channel,
            entries: Immutable.List(entries),
            isLoading: false,
          }),
        (error) =>
          console.log('ChannelViewStore updateForChannelId error:', error)
      )
    )
  );

  readonly onEntryRead = this.effect((entry$: Observable<Entry>) =>
    entry$.pipe(
      concatMap((entry) => this.feedService.updateEntry(entry.id, { readAt: new Date() })),
      concatMap(entry => of(entry) ?? throwError(() => 'feedService.updateEntry returned unexpected '+entry)),
      tapResponse(
        (entry) =>
          this.patchState(state => ({
            entries: state.entries?.map(it => it.id === entry!.id ? entry! : it),
          })),
        (error) =>
          console.log('ChannelViewStore updateForChannelId error:', error)
      )
    )
  );
}
