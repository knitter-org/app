import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import {
  addEntities,
  deleteEntities,
  selectAllEntities,
  selectEntity,
  setEntities,
  upsertEntities,
  withEntities,
} from '@ngneat/elf-entities';
import { Feed } from 'app/services/database.models';
import { FeedReaderService } from 'app/services/feed-reader.service';
import { FeedService } from 'app/services/feed.service';
import { Observable, shareReplay } from 'rxjs';

const store = createStore({ name: 'feeds' }, withEntities<Feed>());

@Injectable({ providedIn: 'root' })
export class FeedsRepository {
  feeds$ = store.pipe(selectAllEntities(), shareReplay({ refCount: true }));

  constructor(
    private feedService: FeedService,
    private feedReaderService: FeedReaderService
  ) {
    this.loadFeeds();
  }

  getFeed$(id: string): Observable<Feed | undefined> {
    return store.pipe(selectEntity(id));
  }

  async createFeedFromUrl(url: string): Promise<Feed> {
    const { title, fetchedAt, entries } =
      await this.feedReaderService.fetchFeed(url);

    const feed = await this.feedService.addFeed(title, url, fetchedAt, entries);
    store.update(addEntities(feed));
    return feed;
  }

  async updateFeed(feed: Feed) {
    const savedFeed = await this.feedService.saveFeed(feed);
    store.update(upsertEntities(savedFeed));
  }

  async deleteFeed(feed: Feed) {
    const savedFeed = await this.feedService.deleteFeed(feed);
    store.update(deleteEntities(feed.id));
  }

  private loadFeeds() {
    this.feedService
      .getFeeds()
      .then((feeds) => store.update(setEntities(feeds)));
  }
}
