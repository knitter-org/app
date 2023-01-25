import { fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { createComponentFactory, mockProvider, Spectator } from '@ngneat/spectator';

import { InitializationComponent } from './initialization.component';
import { InitializationService } from './initialization.service';

describe('InitializationComponent', () => {
  let spectator: Spectator<InitializationComponent>;
  const createComponent = createComponentFactory({
    component: InitializationComponent,
    providers: [
      mockProvider(Router),
      mockProvider(InitializationService)
    ],
    detectChanges: false
  });

  beforeEach(() => spectator = createComponent());

  describe('component accessed but database already initialized', () => {
    it('should redirect to the root path', fakeAsync(() => {
      const initializationService = spectator.inject(InitializationService);
      initializationService.isInitialized.and.returnValue(true);

      spectator.detectChanges();
      spectator.tick();

      expect(spectator.inject(Router).navigateByUrl).toHaveBeenCalledWith('/');
    }));
  });
});
