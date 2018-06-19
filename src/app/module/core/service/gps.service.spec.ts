import { TestBed, inject } from '@angular/core/testing';

import { GpsService } from './gps.service';

describe('GpsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GpsService]
    });
  });

  it('should be created', inject([GpsService], (service: GpsService) => {
    expect(service).toBeTruthy();
  }));
});
