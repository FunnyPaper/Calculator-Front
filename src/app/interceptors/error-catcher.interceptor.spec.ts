import { TestBed } from '@angular/core/testing';

import { ErrorCatcherInterceptor } from './error-catcher.interceptor';

describe('ErrorCatcherInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    providers: [
      ErrorCatcherInterceptor
      ]
  }));

  it('should be created', () => {
    const interceptor: ErrorCatcherInterceptor = TestBed.inject(ErrorCatcherInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
