import {Component, OnInit} from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {RMCPacket} from 'nmea-simple';
import * as formatcoords from 'formatcoords';
import * as leftPad from 'left-pad';
import {Router} from '@angular/router';
import {filter, map} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  public coordAsString$: Observable<string>;

  public trackTrue$: Observable<string>;

  public speed$: Observable<string>;

  public constructor(private gpsService: GpsService, private router: Router) {
  }

  public ngOnInit(): void {
    const rmcData$: Observable<RMCPacket> = this.gpsService.getGPRMC().pipe(
      filter((rmcData: RMCPacket) => !!rmcData && rmcData.status === 'valid')
    );

    this.coordAsString$ = rmcData$.pipe(
      map((rmcPacket: RMCPacket) => formatcoords(rmcPacket.latitude, rmcPacket.longitude)
        .format(
          'Ff',
          {
            latLonSeparator: ' <br/> ',
            decimalPlaces: 3
          }
        )
        .replace(/\d{1,3}[°]/g, (found: string) => leftPad(found, 4, '0'))
        .replace(/\d{1,2}[.]/g, (found: string) => leftPad(found, 3, '0'))
      )
    );

    this.trackTrue$ = rmcData$.pipe(
      map((rmcPacket: RMCPacket) => rmcPacket.trackTrue.toString() + '°')
    );

    this.speed$ = rmcData$.pipe(
      map((rmcPacket: RMCPacket) => rmcPacket.speedKnots.toString())
    );
  }

  public onClick(): void {
    this.router.navigate(['app', 'gps', 'waypoint']);
  }
}

