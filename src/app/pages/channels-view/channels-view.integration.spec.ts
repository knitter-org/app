import { ActivatedRoute } from '@angular/router';
import { EntryListComponent } from 'app/elements/entry-list/entry-list.component';
import { firstValueFrom, of } from 'rxjs';

import { fakeAsync } from '@angular/core/testing';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { ChannelService } from 'app/services/channel.service';
import { produceEntry } from 'test/entry.factory';
import { ChannelsViewComponent } from './channels-view.component';
import { ChannelViewStore } from './channels-view.store';
import { faker } from '@faker-js/faker';

describe('ChannelsViewComponent Integration', () => {
  const TEST_CHANNEL_ID = faker.random.numeric(9);

  let spectator: Spectator<ChannelsViewComponent>;
  const createComponent = createComponentFactory({
    component: ChannelsViewComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: TEST_CHANNEL_ID }),
        },
      },
      ChannelViewStore,
    ],
    mocks: [ChannelService],
    componentMocks: [EntryListComponent],
    detectChanges: false,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should display unread entries', fakeAsync(async () => {
    spectator
      .inject(ChannelService)
      .unreadEntiresOrderedByDate.withArgs(ChannelService.ID_PREFIX + TEST_CHANNEL_ID).and.returnValue([
        produceEntry(),
        produceEntry(),
      ]);
    spectator.detectChanges();
    spectator.tick();

    const entries = await firstValueFrom(
      spectator.query(EntryListComponent)?.entries$!
    );

    expect(entries).toHaveLength(2);
  }));
});
