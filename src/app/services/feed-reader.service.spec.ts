import { TestBed } from '@angular/core/testing';

import { FeedReaderService } from './feed-reader.service';

describe('FeedReaderService', () => {
  let service: FeedReaderService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FeedReaderService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
