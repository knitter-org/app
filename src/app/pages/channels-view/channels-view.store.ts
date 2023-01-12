import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { forkJoin, Observable, switchMap, tap } from 'rxjs';
import { ChannelService } from 'src/app/channel.service';
import { ChannelDoc, EntryDoc } from 'src/app/database.models';

export interface ChannelViewState {
  channel?: ChannelDoc;
  entries?: EntryDoc[];
  isLoading: boolean;
}

@Injectable()
export class ChannelViewStore extends ComponentStore<ChannelViewState> {
  constructor(private channelService: ChannelService) {
    super({ isLoading: false });
  }

  readonly updateForChannelId = this.effect((channelId$: Observable<string>) =>
    channelId$.pipe(
      tap((_) => this.patchState({ isLoading: true })),
      switchMap((channelId) =>
        forkJoin({
          channel: this.channelService.getChannel(ChannelService.ID_PREFIX+channelId),
          entries: this.channelService.entiresOrderedByDate(),
        })
      ),
      tapResponse(
        ({channel, entries}) =>
          this.patchState({
            channel,
            entries,
            isLoading: false,
          }),
        (error) => console.log('ChannelViewStore error:', error)
      )
    )
  );
}
