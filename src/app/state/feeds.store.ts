import { Injectable } from '@angular/core';
import { FeedData } from '@extractus/feed-extractor';
import { createStore } from '@ngneat/elf';
import { selectAllEntities, getEntity, setEntities, withEntities } from '@ngneat/elf-entities';
import { Feed } from 'app/services/database.models';
import { FeedService } from 'app/services/feed.service';
import { shareReplay } from 'rxjs';

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

  getFeed(id: string): Feed | undefined {
    return store.query(getEntity(id));
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
