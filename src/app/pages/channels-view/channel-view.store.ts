import { Injectable } from '@angular/core';
import { ComponentStore, tapResponse } from '@ngrx/component-store';
import { Observable, switchMap, tap } from 'rxjs';
import { ChannelService } from 'src/app/channel.service';
import { EntryDoc } from 'src/app/database.models';

export interface ChannelViewState {
  entries: EntryDoc[];
  isLoading: boolean;
}

@Injectable()
export class ChannelViewStore extends ComponentStore<ChannelViewState> {
  constructor(private channelService: ChannelService) {
    super({ entries: [], isLoading: false });
  }

  readonly fetchEntries = this.effect((channelId$: Observable<string>) =>
    channelId$.pipe(
      tap((_) => this.patchState({ isLoading: true })),
      switchMap((channelId) => this.channelService.entiresOrderedByDate()),
      tapResponse(
        (entries) =>
          this.patchState({
            entries,
            isLoading: false,
          }),
        (error) => console.log('ChannelViewStore error:', error)
      )
    )
  );
}
