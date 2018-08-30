import {Injectable} from '@angular/core';
import {EMPTY, Observable, Subject} from 'rxjs/index';
import {Waypoint} from '../model/waypoint.model';
import {HttpClient} from '@angular/common/http';
import {map, mergeMap, share, tap} from 'rxjs/internal/operators';
import {deserialize, serialize} from 'json-typescript-mapper';
import * as uuid from 'uuid';

@Injectable()
export class WaypointService {

  private waypoints$: Observable<Waypoint[]>;

  public constructor(private httpClient: HttpClient) {
  }

  private makeCache(): void {
    this.waypoints$ = this.httpClient.get('http://localhost:80/waypoints')
      .pipe(
        map((waypoints: any[]) => waypoints.map((waypoint: any) => deserialize(Waypoint, waypoint))),
        share()
      );
  }

  public findAll(): Observable<Waypoint[]> {
    if (!this.waypoints$) {
      this.makeCache();
    }

    return this.waypoints$;
  }

  public findById(id: string): Observable<Waypoint | null> {
    if (!this.waypoints$) {
      this.makeCache();
    }

    return this.waypoints$.pipe(
      map((waypoints: Waypoint[]) => waypoints.find((waypoint: Waypoint) => waypoint.id === id))
    );
  }

  public add(waypoint: Waypoint): Observable<Waypoint> {
    waypoint.id = uuid();

    return this.httpClient.post('http://localhost:80/waypoints', serialize(waypoint)).pipe(
      tap(() => this.makeCache()),
      map(() => waypoint)
    );
  }

  public update(waypoint: Waypoint): Observable<Waypoint> {
    return this.httpClient.put('http://localhost:80/waypoints/' + waypoint.id, serialize(waypoint)).pipe(
      tap(() => this.makeCache()),
      map(() => waypoint)
    );
  }

  public delete(waypoint: Waypoint): Observable<void> {
    return this.httpClient.delete('http://localhost:80/waypoints/' + waypoint.id).pipe(
      tap(() => this.makeCache()),
      mergeMap(() => EMPTY)
    );
  }
}
