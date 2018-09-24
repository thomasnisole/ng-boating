import { TestBed, inject } from '@angular/core/testing';

import { NmeaServerService } from './nmea-server.service';

describe('NmeaServerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NmeaServerService]
    });
  });

  it('should be created', inject([NmeaServerService], (service: NmeaServerService) => {
    expect(service).toBeTruthy();
  }));
});
