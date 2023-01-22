import { TestBed } from '@angular/core/testing';
import { EntryDoc } from './database.models';
import { EntryService } from './entry.service';
import { FeedReaderService } from './feed-reader.service';

import { FeedService } from './feed.service';

describe('FeedService', () => {
  let feedService: FeedService;
  let feedReaderService: FeedReaderService;
  let entryService: EntryService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FeedReaderService, EntryService]
    });
    feedService = TestBed.inject(FeedService);
    feedReaderService = TestBed.inject(FeedReaderService);
    entryService = TestBed.inject(EntryService);
  });

  it('should be created', () => {
    expect(feedService).toBeTruthy();
  });

  describe('fetchEntries', () => {
    const feedId = 'test-feed-id';

    beforeEach(() => {
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
      spyOn(entryService, 'addEntries');
      spyOn(feedReaderService, 'fetchFeed').and.returnValue(Promise.resolve({
        title: 'test-mock-feed',
        entries: []
      }));

      await feedService.fetchEntries(feedId);
      expect(entryService.addEntries).not.toHaveBeenCalled();
    });
  });
});
