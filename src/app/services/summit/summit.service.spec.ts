import { TestBed } from '@angular/core/testing';

import { SummitService } from './summit.service';

describe('SummitService', () => {
  let service: SummitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SummitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
