import { Injectable } from '@angular/core';
import {Observable, of} from 'rxjs/index';
import {Waypoint} from '../model/waypoint.model';
import {UserPreferencesService} from './user-preferences.service';

const remote = (<any>window).require('electron').remote;
export const fs = remote.require('fs');

@Injectable()
export class WaypointService {

  private filePath: string;

  public constructor(private userPreferencesServcice: UserPreferencesService) {
    this.filePath =
      this.userPreferencesServcice.filePath + '/' + this.userPreferencesServcice.preferences.waypointsFileName;
  }

  public findAll(): Observable<Waypoint[]> {
    this.checkFile();

    return of(<Waypoint[]>JSON.parse(fs.readFileSync(this.filePath)).waypoints);
  }

  public findByName(name: string): Observable<Waypoint|null> {
    this.checkFile();

    return of((<Waypoint[]>JSON.parse(fs.readFileSync(this.filePath)).waypoints)
      .find((waypoint: Waypoint) => waypoint.name === name));
  }

  private checkFile(): void {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify({waypoints: [{
        name: 'Grand Jardin',
        description: 'Le phare du Grand Jardin au large de Saint Malo',
        lat: 48.670027777777776,
        lng: -2.082777777777778
      }]}));
    }
  }
}
