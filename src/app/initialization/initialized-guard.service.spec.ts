import { TestBed } from '@angular/core/testing';

import { InitializedGuardService } from './initialized-guard.service';

describe('InitializedGuardService', () => {
  let service: InitializedGuardService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InitializedGuardService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
