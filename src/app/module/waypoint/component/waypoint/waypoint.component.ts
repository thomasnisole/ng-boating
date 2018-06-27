import { Component, OnInit } from '@angular/core';
import {Waypoint} from '../../../core/model/waypoint.model';
import {ActivatedRoute, Params} from '@angular/router';
import {WaypointService} from '../../../core/service/waypoint.service';
import {mergeMap} from 'rxjs/internal/operators';
import {Observable} from 'rxjs/index';

@Component({
  selector: 'app-waypoint',
  templateUrl: './waypoint.component.html',
  styleUrls: ['./waypoint.component.scss']
})
export class WaypointComponent implements OnInit {

  public waypoint$: Observable<Waypoint>;

  public constructor(private activatedRoute: ActivatedRoute, private waypointService: WaypointService) { }

  public ngOnInit(): void {
    this.waypoint$ = this.activatedRoute.params.pipe(
      mergeMap((params: Params) => this.waypointService.findByName(params['waypoint_id']))
    );
  }

}
