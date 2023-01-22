import { TestBed } from '@angular/core/testing';

import { MigratedGuard } from './migrated.guard';

describe('MigratedGuard', () => {
  let guard: MigratedGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(MigratedGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
