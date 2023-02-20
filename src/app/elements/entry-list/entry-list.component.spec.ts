import { byText, createComponentFactory, Spectator } from '@ngneat/spectator';
import { Entry } from 'app/services/database.models';
import { of } from 'rxjs';
import { produceEntry } from 'test/entry.factory';

import { EntryListComponent } from './entry-list.component';

describe('EntryListComponent', () => {
  let spectator: Spectator<EntryListComponent>;
  const createComponent = createComponentFactory({
    component: EntryListComponent,
  });

  beforeEach(() => (spectator = createComponent()));

  describe('on entry click', () => {
    let entries: Entry[];
    let emittedEntries: Entry[];

    beforeEach(() => {
      entries = [
        produceEntry({ readAt: undefined }),
        produceEntry({ readAt: new Date() }),
        produceEntry(),
      ];
      spectator.setInput('entries$', of(entries));

      emittedEntries = [];
      spectator
        .output('onRead')
        .subscribe((entry) => emittedEntries.push(entry as Entry));
    });

    it('should emit an event when clicking an unread entry', () => {
      spectator.click(byText(entries[0].title));
      expect(emittedEntries).toEqual([entries[0]]);
    });

    it('should emit an event when clicking a read entry', () => {
      spectator.click(byText(entries[1].title));
      expect(emittedEntries).toEqual([entries[1]]);
    });
  });
});
