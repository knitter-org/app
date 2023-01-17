import { ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { FeedProxySettingsComponent } from './feed-proxy-settings.component';

describe('FeedProxySettingsComponent', () => {
  let spectator: Spectator<FeedProxySettingsComponent>;

  const createComponent = createComponentFactory({
    component: FeedProxySettingsComponent,
    imports: [ReactiveFormsModule],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
