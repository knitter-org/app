import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { concatMap, forkJoin, Observable, of, switchMap, take, tap } from 'rxjs';
import { ChannelService } from 'app/services/channel.service';
import { ChannelDoc, EntryDoc } from 'app/services/database.models';
import { EntryService } from 'app/services/entry.service';
import { replaceElement } from 'app/utils/collections';

export interface ChannelViewState {
  channel?: ChannelDoc;
  entries?: EntryDoc[];
  isLoading: boolean;
}

@Injectable()
export class ChannelViewStore extends ComponentStore<ChannelViewState> {
  constructor(
    private channelService: ChannelService,
    private entryService: EntryService
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
          entries: this.channelService.unreadEntiresOrderedByDate(),
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

  readonly markEntryAsRead = this.effect((entry$: Observable<EntryDoc>) =>
    entry$.pipe(
      concatMap((entry) =>
        forkJoin({
          oldEntry: of(entry),
          updatedEntry: this.entryService.markEntryAsRead(entry),
          entries: this.select((state) => state.entries).pipe(take(1)),
        })
      ),
      tapResponse(
        ({oldEntry, updatedEntry, entries}) =>
          this.patchState({
            entries: replaceElement(entries!, oldEntry, updatedEntry),
          }),
        (error) =>
          console.log('ChannelViewStore updateForChannelId error:', error)
      )
    )
  );
}
