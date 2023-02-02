import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { ChannelService } from 'app/services/channel.service';
import { ChannelDoc, Entry } from 'app/services/database.models';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';

export interface ChannelViewState {
  channel?: ChannelDoc;
  entries?: Entry[];
  isLoading: boolean;
}

@Injectable()
export class ChannelViewStore extends ComponentStore<ChannelViewState> {
  constructor(
    private channelService: ChannelService
  ) {
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
          entries: this.channelService.unreadEntiresOrderedByDate(
            ChannelService.ID_PREFIX + channelId
          ),
        })
      ),
      tapResponse(
        ({ channel, entries }) =>
          this.patchState({
            channel,
            entries,
            isLoading: false,
          }),
        (error) =>
          console.log('ChannelViewStore updateForChannelId error:', error)
      )
    )
  );

  // readonly markEntryAsRead = this.effect((entry$: Observable<FeedEntry>) =>
  //   entry$.pipe(
  //     concatMap((entry) =>
  //       forkJoin({
  //         oldEntry: of(entry),
  //         updatedEntry: this.entryService.markEntryAsRead(entry),
  //         entries: this.select((state) => state.entries).pipe(take(1)),
  //       })
  //     ),
  //     tapResponse(
  //       ({oldEntry, updatedEntry, entries}) =>
  //         this.patchState({
  //           entries: replaceElement(entries!, oldEntry, updatedEntry),
  //         }),
  //       (error) =>
  //         console.log('ChannelViewStore updateForChannelId error:', error)
  //     )
  //   )
  // );
}
