import { ActivatedRoute } from '@angular/router';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { EntryListComponent } from 'app/elements/entry-list/entry-list.component';
import { MockComponent } from 'ng-mocks';
import { of } from 'rxjs';
import { FeedsViewComponent } from './feeds-view.component';

describe('FeedsViewComponent', () => {
  let spectator: Spectator<FeedsViewComponent>;
  const createComponent = createComponentFactory({
    component: FeedsViewComponent,
    declarations: [MockComponent(EntryListComponent)],
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 123 }),
        },
      },
    ],
    imports: [FontAwesomeModule],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
