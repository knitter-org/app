import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { EntryDoc, FeedDoc } from './database.models';
import { DatabaseService } from './database.service';

import { EntryService } from './entry.service';

describe('EntryService', () => {
  let spectator: SpectatorService<EntryService>;
  const createService = createServiceFactory({
    service: EntryService,
    providers: [DatabaseService],
  });

  beforeEach(() => (spectator = createService()));
  afterEach(async () => await spectator.inject(DatabaseService).dropDatabase());

  describe('addEntries', () => {
    it('should assign well-formed ids', async () => {
      const feedDoc = {
        _id: 'feed:example.com-pb3n7w',
      } as FeedDoc;

      const makeEntry = (n: number) => ({
        title: 'title ' + n,
        text: 'text ' + n,
        url: 'https://example.com/' + n,
        publishedAt: new Date('2023-01-27T19:21:30Z'),
      });
      const entries = [
        makeEntry(1),
        makeEntry(2),
      ];

      const entryIds = await spectator.service.addEntries(entries, feedDoc);
      expect(entryIds).toContain('entry:example.com-pb3n7w/2023-01-27T19:21:30-se6llb');
      expect(entryIds).toContain('entry:example.com-pb3n7w/2023-01-27T19:21:30-se6llc');
    });
  });

  describe('getFeedIdForEntryId', () => {
    it('should return the correct feedId', () => {
      const feedId = spectator.service.getFeedIdForEntryId('entry:example.com-pb3n7w/2023-01-27T19:21:30-se6llb');
      expect(feedId).toEqual('feed:example.com-pb3n7w');
    });
  });
});
