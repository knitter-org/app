import { faker } from '@faker-js/faker';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { produceEntry } from 'test/entry.factory';
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

  describe('addFeed', () => {
    it('should assign a well-formed id', async () => {
      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      feedReaderServiceSpy.fetchFeed.and.returnValue(
        Promise.resolve({
          title: 'Test Feed',
          entries: [],
        })
      );

      let feedDoc = await spectator.service.addFeed(
        'title',
        'https://example.com/feed?format=rss',
        new Date(),
        []
      );
      expect(feedDoc.id).toEqual('feed:example.com-pb3n7w');

      feedDoc = await spectator.service.addFeed(
        'title',
        'https://example.com/1',
        new Date(),
        []
      );
      expect(feedDoc.id).toEqual('feed:example.com-se6llc');
    });
  });

  describe('fetchEntries', () => {
    let feedId: string;

    beforeEach(async () => {
      spectator.inject(FeedReaderService).fetchFeed.and.returnValue(
        Promise.resolve({
          title: 'test-mock-feed',
          entries: [],
        })
      );
      const url = faker.internet.url();
      feedId = await (await spectator.inject(FeedService).addFeed('title', url, new Date('2002-01-01'), [])).id;
    });

    it('should add new entries only', async () => {
      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      feedReaderServiceSpy.fetchFeed.and.returnValue(
        Promise.resolve({
          title: 'test-mock-feed',
          entries: [
            produceEntry({ publishedAt: new Date('2001-01-01') }),
            produceEntry({ publishedAt: new Date('2002-02-02') }),
            produceEntry({ publishedAt: new Date('2003-03-02') }),
          ],
        })
      );

      const feedService = spectator.inject(FeedService);
      await feedService.fetchEntries(feedId);

      const entries = await feedService.getEntries(feedId);
      expect(entries).toHaveSize(2);

      const feed = await feedService.getFeed(feedId);
      expect(
        new Date().getTime() - feed.fetch.lastSuccessfulAt.getTime()
      ).toBeLessThan(1000);
    });

    it('should update lastSuccessfulAt timestamp also if no entries were added', async () => {
      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      feedReaderServiceSpy.fetchFeed.and.returnValue(
        Promise.resolve({
          title: 'test-mock-feed',
          entries: [],
        })
      );

      const feedService = spectator.inject(FeedService);
      await feedService.fetchEntries(feedId);

      const entries = await feedService.getEntries(feedId);
      expect(entries).toHaveSize(0);

      const feed = await feedService.getFeed(feedId);
      expect(
        new Date().getTime() - feed.fetch.lastSuccessfulAt.getTime()
      ).toBeLessThan(1000);
    });

    it('should delete old entries as configured in retention strategy', async () => {
      const feedService = spectator.inject(FeedService);

      await feedService.saveFeed({
        ...(await feedService.getFeed(feedId)),
        retention: {
          strategy: 'delete-older-than',
          thresholdHours: 24,
        },
      });

      const feedReaderServiceSpy = spectator.inject(FeedReaderService);
      const nowTimestampMs = new Date().getTime();
      const oneHourInMs = 60 * 60 * 1000;
      feedReaderServiceSpy.fetchFeed.and.returnValue(
        Promise.resolve({
          title: 'test-mock-feed',
          entries: [
            {
              title: 'now',
              text: '',
              publishedAt: new Date(nowTimestampMs),
              url: faker.internet.url(),
            },
            {
              title: 'now - 22h',
              text: '',
              publishedAt: new Date(nowTimestampMs - 22 * oneHourInMs),
              url: faker.internet.url(),
            },
            {
              title: 'now - 7d',
              text: '',
              publishedAt: new Date(nowTimestampMs - 7 * 24 * oneHourInMs),
              url: faker.internet.url(),
            }
          ],
        })
      );
      await feedService.fetchEntries(feedId);

      const entries = await feedService.getEntries(feedId);
      expect(entries).toHaveSize(2);
    });
  });
});
