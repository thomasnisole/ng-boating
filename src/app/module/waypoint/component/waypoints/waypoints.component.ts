import { Component, OnInit } from '@angular/core';
import {WaypointService} from '../../../core/service/waypoint.service';
import {Waypoint} from '../../../core/model/waypoint.model';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-waypoints',
  templateUrl: './waypoints.component.html',
  styleUrls: ['./waypoints.component.scss']
})
export class WaypointsComponent implements OnInit {

  public waypointSearch: string;

  public waypoints$: Observable<Waypoint[]>;

  public constructor(private waypointService: WaypointService) { }

  public ngOnInit(): void {
    this.waypoints$ = this.waypointService.findAll();
  }
}
