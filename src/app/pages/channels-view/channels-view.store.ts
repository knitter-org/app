import { Injectable } from '@angular/core';
import { createStore, select, withProps } from '@ngneat/elf';
import { selectAllEntities, setEntities, upsertEntities, withEntities } from '@ngneat/elf-entities';
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

  entries$ = store.pipe(selectAllEntities());

  constructor(private channelService: ChannelService, private feedService: FeedService) {}

  async loadChannel(channelId: string): Promise<void> {
    store.update(state => ({ ...state, isLoading: true }));

    const channel = await this.channelService.getChannel(channelId);
    store.update(state => ({...state, channel }));

    const entries = await this.channelService.unreadEntiresOrderedByDate(channelId);
    store.update(setEntities(entries), state => ({ ...state, isLoading: false }));
  }

  async markEntryAsRead(entry: Entry) {
    const updatedEntry = await this.feedService.markEntryAsRead(entry.feedId, entry.id, !entry.readAt);
    store.update(upsertEntities(updatedEntry));
  }
}
