import { Injectable } from '@angular/core';
import { createStore } from '@ngneat/elf';
import { getEntity, selectAllEntities, selectEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { Feed } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { Observable, shareReplay } from 'rxjs';

const store = createStore(
  { name: 'feeds' },
  withEntities<Feed>()
);

@Injectable({ providedIn: 'root' })
export class FeedsRepository {
  feeds$ = store.pipe(selectAllEntities(), shareReplay({ refCount: true }));

  constructor(private feedService: FeedService) {
    this.loadFeeds();
  }

  getFeed$(id: string): Observable<Feed | undefined> {
    return store.pipe(selectEntity(id));
  }

  async createFeedFromUrl(url: string): Promise<Feed> {
    throw new Error('Method not implemented.');
  }

  async updateFeed(feed: Feed) {
    const savedFeedDoc = await this.feedService.saveFeed(feed);
    store.update(setEntities([savedFeedDoc]));
  }

  private loadFeeds() {
    this.feedService.getFeeds().then(feeds => store.update(setEntities(feeds)));
  }
}
