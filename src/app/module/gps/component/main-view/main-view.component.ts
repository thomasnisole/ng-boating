import {Component, OnInit} from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {RMCPacket} from 'nmea-simple';
import * as formatcoords from 'formatcoords';
import * as leftPad from 'left-pad';
import {Router} from '@angular/router';
import {filter} from 'rxjs/internal/operators';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-main-view',
  templateUrl: './main-view.component.html',
  styleUrls: ['./main-view.component.scss']
})
export class MainViewComponent implements OnInit {

  public rmcData$: Observable<RMCPacket>;

  public constructor(private gpsService: GpsService, private router: Router) {
  }

  public ngOnInit(): void {
    this.rmcData$ = this.gpsService.getGPRMC().pipe(
      filter((rmcData: RMCPacket) => !!rmcData)
    );
  }

  public onClick(): void {
    this.router.navigate(['app', 'gps', 'waypoint']);
  }

  public getTractTrue(rmcPacket: RMCPacket): string {
    return rmcPacket && rmcPacket.status === 'valid' ? rmcPacket.trackTrue.toString() + '°' : '';
  }

  public getSpeed(rmcPacket: RMCPacket): string {
    return rmcPacket && rmcPacket.status === 'valid' ? rmcPacket.speedKnots.toString() : '';
  }

  public getCoordAsString(rmcPacket: RMCPacket): string {
    if (!rmcPacket) {
      return '';
    }

    return formatcoords(rmcPacket.latitude, rmcPacket.longitude)
      .format(
        'Ff',
        {
          latLonSeparator: ' <br/> ',
          decimalPlaces: 3
        }
      )
      .replace(/\d{1,3}[°]/g, (found: string) => leftPad(found, 4, '0'))
      .replace(/\d{1,2}[.]/g, (found: string) => leftPad(found, 3, '0'));
  }
}

