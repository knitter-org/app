import { Injectable, OnDestroy } from '@angular/core';
import { createStore, filterNil, select, Store, withProps } from '@ngneat/elf';
import {
  selectAllEntities,
  withEntities
} from '@ngneat/elf-entities';
import { Entry, Feed } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { Observable } from 'rxjs';

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

  loadFeed(feedId: string) {
    this.store.reset();
    this.store.update(state => ({...state, isLoading: true}));

    this.feedService
      .getFeed(feedId)
      .then((feed) => this.store.update((state) => ({ ...state, feed: feed })))
      // .then(() => this.loadEntries());
  }
}
