import {Injectable} from '@angular/core';
import {EMPTY, Observable, throwError} from 'rxjs/index';
import {Waypoint} from '../model/waypoint.model';
import {HttpClient} from '@angular/common/http';
import {map, tap} from 'rxjs/internal/operators';
import {deserialize, serialize} from 'json-typescript-mapper';
import * as uuid from 'uuid';

@Injectable()
export class WaypointService {

  public constructor(private httpClient: HttpClient) {
  }

  public findAll(): Observable<Waypoint[]> {
    return this.httpClient.get('http://localhost:80/waypoints')
      .pipe(
        map((waypoints: any[]) => waypoints.map((waypoint: any) => deserialize(Waypoint, waypoint)))
      );
  }

  public findById(id: string): Observable<Waypoint> {
    return this.httpClient.get('http://localhost:80/waypoints/' + id)
      .pipe(
        map((waypoint: any) => deserialize(Waypoint, waypoint))
      );
  }

  public add(waypoint: Waypoint): Observable<Waypoint> {
    waypoint.id = uuid();

    return this.httpClient.post('http://localhost:80/waypoints', serialize(waypoint)).pipe(
      map(() => waypoint)
    );
  }

  public update(waypoint: Waypoint): Observable<Waypoint> {
    return this.httpClient.put('http://localhost:80/waypoints/' + waypoint.id, serialize(waypoint)).pipe(
      map(() => waypoint)
    );
  }

  public delete(waypoint: Waypoint): Observable<any> {
    return this.httpClient.delete('http://localhost:80/waypoints/' + waypoint.id);
  }
}
