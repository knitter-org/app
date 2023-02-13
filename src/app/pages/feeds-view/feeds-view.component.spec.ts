import { ActivatedRoute } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { FeedsViewComponent } from './feeds-view.component';

describe('FeedsViewComponent', () => {
  let spectator: Spectator<FeedsViewComponent>;
  const createComponent = createComponentFactory({
    component: FeedsViewComponent,
    providers: [
      {
        provide: ActivatedRoute,
        useValue: {
          params: of({ id: 123 }),
        },
      },
    ],
  });

  beforeEach(() => (spectator = createComponent()));

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
