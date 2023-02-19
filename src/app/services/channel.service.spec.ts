// import { faker } from '@faker-js/faker';
// import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
// import { MigrationService } from 'app/pages/migration/migration.service';
// import { produceEntry } from 'test/entry.factory';

// import { ChannelService } from './channel.service';
// import { DatabaseService } from './database.service';
// import { FeedService } from './feed.service';

// describe('ChannelService', () => {
//   let spectator: SpectatorService<ChannelService>;
//   const createService = createServiceFactory({
//     service: ChannelService,
//     providers: [DatabaseService, MigrationService, FeedService],
//   });

//   beforeEach(() => (spectator = createService()));
//   afterEach(async () => await spectator.inject(DatabaseService).dropDatabase());

//   describe('unreadEntiresOrderedByDate', () => {
//     beforeEach(async () => {
//       await spectator.inject(MigrationService).migrate();

//       await spectator.inject(FeedService).addFeed('feed1', faker.internet.url(), new Date(), [
//         produceEntry({ readAt: undefined }),
//         produceEntry({ readAt: new Date() }),
//         produceEntry({ readAt: undefined }),
//       ]);


//       await spectator.inject(FeedService).addFeed('feed2', faker.internet.url(), new Date(), [
//         produceEntry({ readAt: new Date() }),
//         produceEntry({ readAt: new Date() }),
//         produceEntry({ readAt: undefined }),
//       ]);
//     });

//     it('should return all unread entries', async () => {
//       const entries = await spectator.service.unreadEntiresOrderedByDate('timeline');
//       expect(entries).toHaveSize(3);
//     });
//   });
// });
