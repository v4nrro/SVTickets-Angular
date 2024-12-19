import { HttpInterceptorFn } from '@angular/common/http';

import { baseUrlInterceptor } from './base-url.interceptor';
import { TestBed } from '@angular/core/testing';

describe('baseUrlInterceptor', () => {
  const interceptor: HttpInterceptorFn = (req, next) => 
    TestBed.runInInjectionContext(() => baseUrlInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
