import { Injectable, OnDestroy } from '@angular/core';
import { createStore, filterNil, select, Store, withProps } from '@ngneat/elf';
import {
  selectAllEntities,
  setEntities,
  upsertEntities,
  withEntities
} from '@ngneat/elf-entities';
import { Entry, Feed } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { filter, map, Observable } from 'rxjs';

interface FeedViewProps {
  isLoading: boolean;
  feed?: Feed;
}

const storeFactory = () => createStore(
  { name: 'feed-view' },
  withProps<FeedViewProps>({ isLoading: false }),
  withEntities<Entry>()
);

@Injectable()
export class FeedViewRepository implements OnDestroy {
  private store: Store;

  constructor(private feedService: FeedService) {
    this.store = storeFactory();
  }

  ngOnDestroy(): void {
    this.store.destroy();
  }

  isLoading$(): Observable<boolean> {
    return this.store.pipe(select(state => state.isLoading));
  }

  feed$(): Observable<Feed> {
    return this.store.pipe(select(state => state.feed), filterNil());
  }

  entries$(): Observable<Entry[]> {
    return this.store.pipe(selectAllEntities());
  }

  async loadFeed(feedId: string) {
    this.store.reset();

    this.store.update(state => ({...state, isLoading: true}));

    // Load feed first
    const feed = await this.feedService.getFeed(feedId);
    this.store.update((state) => ({ ...state, feed: feed }));

    // Then, load the entries
    const entries = await (await this.feedService.getEntries(feedId)).filter(entry => !entry.readAt);
    this.store.update(setEntities(entries), (state) => ({ ...state, isLoading: false }));
  }

  async markEntryAsRead(entry: Entry) {
    const updatedEntry = await this.feedService.markEntryAsRead(entry.feedId, entry.id, !entry.readAt);
    this.store.update(upsertEntities(updatedEntry));
  }
}
