import { CanActivateFn } from '@angular/router';

import { numericIdGuard } from './numeric-id.guard';
import { TestBed } from '@angular/core/testing';

describe('numericIdGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => numericIdGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
