import { TestBed, inject } from '@angular/core/testing';

import { NmeaClientService } from './nmea-client.service';

describe('NmeaClientService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NmeaClientService]
    });
  });

  it('should be created', inject([NmeaClientService], (service: NmeaClientService) => {
    expect(service).toBeTruthy();
  }));
});
