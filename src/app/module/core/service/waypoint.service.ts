import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';
import {Waypoint} from '../model/waypoint.model';
import {HttpClient} from '@angular/common/http';
import {map} from 'rxjs/internal/operators';
import * as uuid from 'uuid';
import {environment} from '../../../../environments/environment';
import {NgxTsDeserializerService, NgxTsSerializerService} from 'ngx-ts-serializer';

@Injectable()
export class WaypointService {

  public constructor(private httpClient: HttpClient,
                     private deserializer: NgxTsDeserializerService,
                     private serializer: NgxTsSerializerService) {
  }

  public findAll(): Observable<Waypoint[]> {
    return this.httpClient.get(environment.backendUrl + 'waypoints')
      .pipe(
        map((waypoints: any[]) => this.deserializer.deserialize(Waypoint, waypoints))
      );
  }

  public findById(id: string): Observable<Waypoint> {
    return this.httpClient.get(environment.backendUrl + 'waypoints/' + id)
      .pipe(
        map((waypoint: any) => this.deserializer.deserialize(Waypoint, waypoint))
      );
  }

  public add(waypoint: Waypoint): Observable<Waypoint> {
    waypoint.id = uuid();

    return this.httpClient.post(environment.backendUrl + 'waypoints', this.serializer.serialize(waypoint)).pipe(
      map(() => waypoint)
    );
  }

  public update(waypoint: Waypoint): Observable<Waypoint> {
    return this.httpClient.put(environment.backendUrl + 'waypoints/' + waypoint.id, this.serializer.serialize(waypoint)).pipe(
      map(() => waypoint)
    );
  }

  public delete(waypoint: Waypoint): Observable<any> {
    return this.httpClient.delete(environment.backendUrl + 'waypoints/' + waypoint.id);
  }
}
