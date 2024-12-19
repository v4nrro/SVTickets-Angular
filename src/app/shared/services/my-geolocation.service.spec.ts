import { TestBed } from '@angular/core/testing';

import { MyGeolocationService } from './my-geolocation.service';

describe('MyGeolocationService', () => {
  let service: MyGeolocationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MyGeolocationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
