import {Injectable} from '@angular/core';
import {EMPTY, Observable, throwError} from 'rxjs/index';
import {Waypoint} from '../model/waypoint.model';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/internal/operators';
import {deserialize, serialize} from 'json-typescript-mapper';
import * as uuid from 'uuid';
import {environment} from '../../../../environments/environment';

@Injectable()
export class WaypointService {

  public constructor(private httpClient: HttpClient) {
  }

  public findAll(): Observable<Waypoint[]> {
    return this.httpClient.get(environment.backendUrl + 'waypoints')
      .pipe(
        map((waypoints: any[]) => waypoints.map((waypoint: any) => deserialize(Waypoint, waypoint)))
      );
  }

  public findById(id: string): Observable<Waypoint> {
    return this.httpClient.get(environment.backendUrl + 'waypoints/' + id)
      .pipe(
        map((waypoint: any) => deserialize(Waypoint, waypoint))
      );
  }

  public add(waypoint: Waypoint): Observable<Waypoint> {
    waypoint.id = uuid();

    return this.httpClient.post(environment.backendUrl + 'waypoints', serialize(waypoint)).pipe(
      map(() => waypoint)
    );
  }

  public update(waypoint: Waypoint): Observable<Waypoint> {
    return this.httpClient.put(environment.backendUrl + 'waypoints/' + waypoint.id, serialize(waypoint)).pipe(
      map(() => waypoint)
    );
  }

  public delete(waypoint: Waypoint): Observable<any> {
    return this.httpClient.delete(environment.backendUrl + 'waypoints/' + waypoint.id);
  }
}
