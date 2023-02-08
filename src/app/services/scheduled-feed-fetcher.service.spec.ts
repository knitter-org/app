import { discardPeriodicTasks, fakeAsync, tick } from '@angular/core/testing';
import { createServiceFactory, SpectatorService, SpyObject } from '@ngneat/spectator';
import { MigrationService } from 'app/pages/migration/migration.service';
import { of } from 'rxjs';
import { FeedService } from './feed.service';

import { ScheduledFeedFetcherService } from './scheduled-feed-fetcher.service';

describe('ScheduledFeedFetcherService', () => {
  let spectator: SpectatorService<ScheduledFeedFetcherService>;
  const createService = createServiceFactory({
    service: ScheduledFeedFetcherService,
    providers: [],
    entryComponents: [],
    mocks: [FeedService, MigrationService]
  });

  it('should trigger every 60 seconds', fakeAsync(() => {
    spectator = createService();

    const migrationServiceSpy = spectator.inject(MigrationService) as SpyObject<MigrationService>;
    migrationServiceSpy.needsMigration.and.returnValue(of(false));

    const feedServiceSpy = spectator.inject(FeedService) as SpyObject<FeedService>;
    feedServiceSpy.getFeeds.and.returnValue([]);

    expect(feedServiceSpy.getFeeds).not.toHaveBeenCalled();
    tick(30000);
    expect(feedServiceSpy.getFeeds).not.toHaveBeenCalled();
    tick(30000);
    expect(feedServiceSpy.getFeeds).toHaveBeenCalledTimes(1);
    tick(60000);
    expect(feedServiceSpy.getFeeds).toHaveBeenCalledTimes(2);

    discardPeriodicTasks();
  }));

  it('should not trigger when database migratons are due', fakeAsync(() => {
    spectator = createService();

    const migrationServiceSpy = spectator.inject(MigrationService) as SpyObject<MigrationService>;
    migrationServiceSpy.needsMigration.and.returnValue(of(true));

    const feedServiceSpy = spectator.inject(FeedService);

    tick(60000);
    expect(feedServiceSpy.getFeeds).not.toHaveBeenCalled();
    tick(60000);
    expect(feedServiceSpy.getFeeds).not.toHaveBeenCalled();

    discardPeriodicTasks();
  }));
});
