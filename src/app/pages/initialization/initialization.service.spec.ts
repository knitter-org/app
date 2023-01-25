import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { DatabaseService } from 'app/database.service';
import { MigrationService } from '../migration/migration.service';

import { InitializationService } from './initialization.service';

describe('InitializationService', () => {
  let spectator: SpectatorService<InitializationService>;
  const createService = createServiceFactory({
    service: InitializationService,
    providers: [DatabaseService, MigrationService],
  });

  beforeEach(() => (spectator = createService()));
  afterEach(async () => await spectator.inject(DatabaseService).dropDatabase());

  describe('initialize', () => {
    it('should initialize an empty database', async () => {
      expect(await spectator.service.isInitialized()).toBeFalse();
      await spectator.service.initialize();
      expect(await spectator.service.isInitialized()).toBeTrue();
    });
  });

  it('should not require any migrations after initialize', async () => {
    await spectator.service.initialize();
    expect(await spectator.inject(MigrationService).needsMigration()).toBeFalse();
  });
});
FileSystemHandle
