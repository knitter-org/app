import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { EntryListComponent } from './entry-list.component';

describe('EntryListComponent', () => {
  let spectator: Spectator<EntryListComponent>;
  const createComponent = createComponentFactory({
    component: EntryListComponent,
  });

  beforeEach(() => spectator = createComponent());

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
