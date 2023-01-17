import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MockComponent } from 'ng-mocks';
import { FeedProxySettingsComponent } from './feed-proxy-settings/feed-proxy-settings.component';
import { ServerSettingsComponent } from './server-settings/server-settings.component';

import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let spectator: Spectator<SettingsComponent>;

  const createComponent = createComponentFactory({
    component: SettingsComponent,
    declarations: [
      MockComponent(ServerSettingsComponent),
      MockComponent(FeedProxySettingsComponent),
    ],
    shallow: true,
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});
