import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DatabaseService } from './database.service';
import { FeedReaderService } from './feed-reader.service';

import { FeedService } from './feed.service';

describe('FeedService', () => {
  let spectator: SpectatorService<FeedService>;
  const createService = createServiceFactory({
    service: FeedService,
    providers: [DatabaseService],
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
          lastSuccessfulAt: new Date('2002-01-30'),
          intervalMinutes: 5,
        },
        retention: { strategy: 'keep-forever' },
        entries: [],
      }));
    });

    it('should not add new entries only', async () => {
      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      feedReaderServiceSpy.fetchFeed.and.returnValue(Promise.resolve({
        title: 'test-mock-feed',
        entries: [
          { title: 't1', text: 'txt1', publishedAt: new Date('2001-01-01'), url: 'u1' },
          { title: 't2', text: 'txt2', publishedAt: new Date('2002-02-02'), url: 'u2' },
          { title: 't3', text: 'txt3', publishedAt: new Date('2003-03-02'), url: 'u3' },
        ]
      }));

      const feedService = spectator.inject(FeedService);
      await feedService.fetchEntries(feedId);

      const feedDoc = await feedService.getFeed(feedId);
      expect(feedDoc.entries).toHaveSize(2);
      expect(new Date().getTime() - feedDoc.fetch.lastSuccessfulAt.getTime()).toBeLessThan(1000);
    });

    it('should update lastSuccessfulAt timestamp also if no entries were added', async () => {
      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      feedReaderServiceSpy.fetchFeed.and.returnValue(Promise.resolve({
        title: 'test-mock-feed',
        entries: []
      }));

      const feedService = spectator.inject(FeedService);
      await feedService.fetchEntries(feedId);

      const feedDoc = await feedService.getFeed(feedId);
      expect(feedDoc.entries).toHaveSize(0);
      expect(new Date().getTime() - feedDoc.fetch.lastSuccessfulAt.getTime()).toBeLessThan(1000);
    });
  });
});
