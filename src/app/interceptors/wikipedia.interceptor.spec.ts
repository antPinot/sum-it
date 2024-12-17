import { TestBed } from '@angular/core/testing';

import { WikipediaInterceptor } from './wikipedia.interceptor';

describe('WikipediaInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      WikipediaInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: WikipediaInterceptor = TestBed.inject(WikipediaInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
