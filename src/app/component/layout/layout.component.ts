import {Component, OnDestroy, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/internal/operators';
import {GpsService} from '../../module/core/service/gps.service';
import {GGAPacket} from 'nmea-simple';
import {Waypoint} from '../../module/core/model/waypoint.model';
import {Observable, Subscription} from 'rxjs/index';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit, OnDestroy {

  private ggaPacketSubscription: Subscription;

  public title: string;

  public ggaPacket: GGAPacket;

  public currentWaypoint$: Observable<Waypoint>;

  public constructor(private router: Router, private activatedRoute: ActivatedRoute, private gpsService: GpsService) {
    this.ggaPacketSubscription = this.router
      .events
      .pipe(
        filter((event: any) => event instanceof NavigationEnd),
        map(() => this.activatedRoute),
        map((route) => {
          while (route.firstChild) {
            route = route.firstChild;
          }

          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data: any[]) => this.title = data['title']);
  }

  public ngOnInit(): void {
    this.gpsService.getGPGGA().subscribe(
      (ggaPacket: GGAPacket) => this.ggaPacket = ggaPacket
    );

    this.currentWaypoint$ = this.gpsService.currentWaypoint$;
  }

  public ngOnDestroy(): void {
    if (this.ggaPacketSubscription) {
      this.ggaPacketSubscription.unsubscribe();
    }
  }

  public isConnected(): boolean {
    if (!this.ggaPacket) {
      return false;
    }

    if (!this.ggaPacket.fixType) {
      return false;
    }

    return this.ggaPacket.fixType !== 'none';
  }

  public cancelCurrentWaypoint(): void {
    this.gpsService.changeCurrentWaypoint(null);
  }
}
