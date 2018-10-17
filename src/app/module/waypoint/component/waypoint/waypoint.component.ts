import {Component, OnInit} from '@angular/core';
import {Waypoint} from '../../../core/model/waypoint.model';
import {ActivatedRoute, Params, Router} from '@angular/router';
import {WaypointService} from '../../../core/service/waypoint.service';
import {catchError, mergeMap} from 'rxjs/internal/operators';
import {EMPTY, Observable, of} from 'rxjs/index';
import {NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {TranslateService} from '@ngx-translate/core';
import {GpsService} from '../../../core/service/gps.service';

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
    private router: Router,
    private modalService: NgbModal,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private gpsService: GpsService) {
  }

  public ngOnInit(): void {
    this.waypoint$ = this.activatedRoute.params.pipe(
      mergeMap((p: Params) => {
        if (!p['waypoint_id']) {
          return of(new Waypoint());
        } else {
          return this.waypointService.findById(p['waypoint_id']).pipe(
            catchError(() => {
              this.router.navigate(['app', 'waypoints', 'add']);

              return EMPTY;
            })
          );
        }
      })
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
      (waypoint: Waypoint) => this.router.navigate(['app', 'waypoints']),
      (err) => {
        if (toAdd) {
          value.id = null;
        }
      }
    );
  }

  public openModalDeletion(content: any): void {
    this.modalService.open(content).result.then(
      (result: Waypoint) => {
        if (!result) {
          return;
        }

        this.waypointService.delete(result).subscribe(
          () => {
            this.router.navigate(['app', 'waypoints']);
          },
          () => this.toastr.error(this.translateService.instant('error.an-error-occurred'))
        );
      },
      () => void 0
    );
  }

  public openModalToGoTo(content: any): void {
    this.modalService.open(content).result.then(
      (result: Waypoint) => {
        if (!result) {
          return;
        }

        this.gpsService.changeCurrentWaypoint(result);
        this.router.navigate(['app', 'gps', 'waypoint']);
      },
      () => void 0
    );
  }
}
