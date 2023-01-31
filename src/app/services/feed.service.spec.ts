import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DatabaseService } from './database.service';
import { EntryService } from './entry.service';
import { FeedReaderService } from './feed-reader.service';

import { FeedService } from './feed.service';

describe('FeedService', () => {
  let spectator: SpectatorService<FeedService>;
  const createService = createServiceFactory({
    service: FeedService,
    providers: [DatabaseService, EntryService],
    mocks: [FeedReaderService],
  });

  beforeEach(() => (spectator = createService()));
  afterEach(async () => await spectator.inject(DatabaseService).dropDatabase());

  describe('fetchEntries', () => {
    it('should assign a well-formed id', async () => {
      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      feedReaderServiceSpy.fetchFeed.and.returnValue(Promise.resolve({
        title: 'Test Feed',
        entries: [],
      }))

      let feedDoc = await spectator.service.addFeed('title', 'https://example.com/feed?format=rss', new Date(), []);
      expect(feedDoc._id).toEqual('feed:example.com-pb3n7w');

      feedDoc = await spectator.service.addFeed('title', 'https://example.com/1', new Date(), []);
      expect(feedDoc._id).toEqual('feed:example.com-se6llc');
    });
  });

  describe('fetchEntries', () => {
    const feedId = 'test-feed-id';

    beforeEach(() => {
      const feedService = spectator.inject(FeedService);
      spyOn(feedService, 'getFeed').and.returnValue(Promise.resolve({
        _id: 'abc123',
        type: 'feed',
        title: 'test-feed',
        url: 'http://example.com',
        fetch: {
          lastSuccessfulAt: new Date('2020-10-10'),
          intervalMinutes: 5,
        },
        retention: { strategy: 'keep-forever' },
      }));
    });

    it('should not store new entries when nothing was returned by the feed reader', async () => {
      const entryService = spectator.inject(EntryService);
      spyOn(entryService, 'addEntries');

      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      feedReaderServiceSpy.fetchFeed.and.returnValue(Promise.resolve({
        title: 'test-mock-feed',
        entries: []
      }));

      const feedService = spectator.inject(FeedService);
      await feedService.fetchEntries(feedId);
      expect(entryService.addEntries).not.toHaveBeenCalled();
    });
  });
});
