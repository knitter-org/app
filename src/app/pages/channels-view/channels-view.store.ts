import { Injectable } from '@angular/core';
import { createStore, filterNil, select, withProps } from '@ngneat/elf';
import { selectAllEntities, withEntities } from '@ngneat/elf-entities';
import { removeStore } from '@ngneat/elf/src/lib/registry';
import { ChannelService } from 'app/services/channel.service';
import { ChannelDoc, Entry } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';

export interface ChannelViewState {
  channel?: ChannelDoc;
  isLoading: boolean;
}

const store = createStore(
  { name: 'channel-view' },
  withProps<ChannelViewState>({ isLoading: false }),
  withEntities<Entry>(),
);

@Injectable()
export class ChannelViewStore {
  isLoading$ = store.pipe(select(state => state.isLoading));

  channel$ = store.pipe(select(state => state.channel), filterNil());

  entries$ = store.pipe(selectAllEntities());

  constructor(private channelService: ChannelService, private feedService: FeedService) {
    store.reset();
  }

  updateForChannelId(channelId: any): void {
    // store.update(state => ({ ...state, isLoading: true }));
    // this.channelService.getChannel(channelId);
    // store.update(state => ({ ...state, isLoading: false }));
  }


//   readonly updateForChannelId = this.effect((channelId$: Observable<string>) =>
//     channelId$.pipe(
//       tap((_) => this.patchState({ isLoading: true })),
//       switchMap((channelId) =>
//         forkJoin({
//           channel: this.channelService.getChannel(
//             ChannelService.ID_PREFIX + channelId
//           ),
//           entries: this.channelService.unreadEntiresOrderedByDate(channelId),
//         })
//       ),
//       tapResponse(
//         ({ channel, entries }) =>
//           this.patchState({
//             channel,
//             entries: Immutable.List(entries),
//             isLoading: false,
//           }),
//         (error) =>
//           console.log('ChannelViewStore updateForChannelId error:', error)
//       )
//     )
//   );

//   readonly onEntryRead = this.effect((entry$: Observable<Entry>) =>
//     entry$.pipe(
//       concatMap((entry) => this.feedService.updateEntry(entry.id, { readAt: new Date() })),
//       concatMap(entry => of(entry) ?? throwError(() => 'feedService.updateEntry returned unexpected '+entry)),
//       tapResponse(
//         (entry) =>
//           this.patchState(state => ({
//             entries: state.entries?.map(it => it.id === entry!.id ? entry! : it),
//           })),
//         (error) =>
//           console.log('ChannelViewStore updateForChannelId error:', error)
//       )
//     )
//   );
}
