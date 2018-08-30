import {Injectable} from '@angular/core';
import {Waypoint} from '../../core/model/waypoint.model';
import {ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot} from '@angular/router';
import {EMPTY, Observable} from 'rxjs/index';
import {WaypointService} from '../../core/service/waypoint.service';
import {map} from 'rxjs/internal/operators';

@Injectable()
export class WaypointResolver implements Resolve<Waypoint> {

  public constructor(private waypointService: WaypointService, private router: Router) {}

  public resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Waypoint> {
    if (!route.params['waypoint_id']) {
      this.router.navigate(['app', 'waypoints', 'add']);

      return EMPTY;
    }

    return this.waypointService.findById(route.params['waypoint_id']).pipe(
      map((waypoint: Waypoint) => {
        if (waypoint) {
          return waypoint;
        } else {
          this.router.navigate(['app', 'waypoints', 'add']);

          return null;
        }
      })
    );
  }
}
