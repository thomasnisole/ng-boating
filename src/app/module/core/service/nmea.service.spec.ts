import { TestBed, inject } from '@angular/core/testing';

import { NmeaService } from './nmea.service';

describe('NmeaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NmeaService]
    });
  });

  it('should be created', inject([NmeaService], (service: NmeaService) => {
    expect(service).toBeTruthy();
  }));
});
