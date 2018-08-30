import {Component, OnInit} from '@angular/core';
import {Waypoint} from '../../../core/model/waypoint.model';
import {ActivatedRoute, Data, Router} from '@angular/router';
import {WaypointService} from '../../../core/service/waypoint.service';
import {map, mergeMap} from 'rxjs/internal/operators';
import {Observable} from 'rxjs/index';

@Component({
  selector: 'app-waypoint',
  templateUrl: './waypoint.component.html',
  styleUrls: ['./waypoint.component.scss']
})
export class WaypointComponent implements OnInit {

  public waypoint$: Observable<Waypoint>;

  public constructor(
    private activatedRoute: ActivatedRoute,
    private waypointService: WaypointService,
    private router: Router) {
  }

  public ngOnInit(): void {
    this.waypoint$ = this.activatedRoute.data.pipe(
      map((data: Data) => data['waypoint']),
      map((waypoint: Waypoint) => waypoint ? waypoint : new Waypoint())
    );
  }

  public submit(value): void {
    let observable$: Observable<Waypoint>;
    let toAdd: boolean = false;
    if (value.id) {
      observable$ = this.waypointService.update(value);
    } else {
      toAdd = true;
      observable$ = this.waypointService.add(value);
    }

    observable$.subscribe(
      (waypoint: Waypoint) => this.router.navigate(['app', 'waypoints', waypoint.id]),
      (err) => {
        if (toAdd) {
          value.id = null;
        }
      }
    );
  }
}
