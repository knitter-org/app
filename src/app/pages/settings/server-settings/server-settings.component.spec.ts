import { ReactiveFormsModule } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { ServerSettingsComponent } from './server-settings.component';

describe('ServerSettingsComponent', () => {
  let spectator: Spectator<ServerSettingsComponent>;

  const createComponent = createComponentFactory({
    component: ServerSettingsComponent,
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
