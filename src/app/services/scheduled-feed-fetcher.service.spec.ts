import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { FeedService } from './feed.service';

import { ScheduledFeedFetcherService } from './scheduled-feed-fetcher.service';

describe('ScheduledFeedFetcherService', () => {
  let spectator: SpectatorService<ScheduledFeedFetcherService>;
  const createService = createServiceFactory({
    service: ScheduledFeedFetcherService,
    providers: [],
    entryComponents: [],
    mocks: [FeedService]
  });

  it('should trigger every 60 seconds', fakeAsync(() => {
    spectator = createService();

    const feedService = spectator.inject(FeedService);
    feedService.getFeeds.and.returnValue([]);

    expect(feedService.getFeeds).not.toHaveBeenCalled();
    tick(30000);
    expect(feedService.getFeeds).not.toHaveBeenCalled();
    tick(30000);
    expect(feedService.getFeeds).toHaveBeenCalledTimes(1);
    tick(60000);
    expect(feedService.getFeeds).toHaveBeenCalledTimes(2);

    discardPeriodicTasks();
  }));
});
