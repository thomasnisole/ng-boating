import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map, mergeMap} from 'rxjs/internal/operators';
import {GpsService} from '../../module/core/service/gps.service';
import {GGAPacket} from 'nmea-simple';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {

  public title: string;

  public ggaPacket: GGAPacket;

  public constructor(private router: Router, private activatedRoute: ActivatedRoute, private gpsService: GpsService) {
    this.router
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
    this.gpsService.getGGAData().subscribe(
      (ggaPacket: GGAPacket) => this.ggaPacket = ggaPacket
    );
  }

  public isConnected(): boolean {
    if (!this.ggaPacket) {
      return false;
    }

    return this.ggaPacket.fixType !== 'none';
  }

}
