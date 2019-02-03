import {Injectable} from '@angular/core';
import {combineLatest, EMPTY, Observable, of} from 'rxjs';
import {Waypoint} from '../model/waypoint.model';
import {filter, map, mergeMap, tap} from 'rxjs/internal/operators';
import * as uuid from 'uuid';
import {NgxTsDeserializerService, NgxTsSerializerService} from 'ngx-ts-serializer';
import {ElectronService} from '../../system/service/electron.service';
import {environment} from '../../../../environments/environment';

@Injectable()
export class WaypointService {

  private filePath: string = this.electronService.os.homedir() + '/.ng-boating';

  private readonly waypointsFileName: string = environment.waypointsFileName;

  public constructor(private electronService: ElectronService,
                     private deserializer: NgxTsDeserializerService,
                     private serializer: NgxTsSerializerService) {
    if (!this.electronService.fs.existsSync(this.filePath + '/' + this.waypointsFileName)) {
      this.electronService.fs.writeFileSync(this.filePath + '/' + this.waypointsFileName, JSON.stringify([]));
    }
  }

  public findAll(): Observable<Waypoint[]> {
    return of(this.electronService.fs.readFileSync(this.filePath + '/' + this.waypointsFileName, 'utf8')).pipe(
      map((response: string) => JSON.parse(response)),
      map((waypoints: any[]) => this.deserializer.deserialize(Waypoint, waypoints))
    );
  }

  public findById(id: string): Observable<Waypoint> {
    return this.findAll().pipe(
      mergeMap((waypoints: Waypoint[]) => waypoints),
      filter((waypoint: Waypoint) => waypoint.id === id)
    );
  }

  public add(waypoint: Waypoint): Observable<Waypoint> {
    waypoint.id = uuid();

    return combineLatest(this.findAll(), of(waypoint)).pipe(
      tap(([waypoints, wp]:  [Waypoint[], Waypoint]) => waypoints.push(wp)),
      tap(([waypoints]:  [Waypoint[]]) => this.electronService.fs.writeFileSync(
        this.filePath + '/' + this.waypointsFileName,
        JSON.stringify(this.serializer.serialize(waypoints))
      )),
      map(([waypoints, wp]:  [Waypoint[], Waypoint]) => wp)
    );
  }

  public update(waypoint: Waypoint): Observable<Waypoint> {
    return combineLatest(this.findAll(), of(waypoint)).pipe(
      map(([waypoints, wp]:  [Waypoint[], Waypoint]) => {
        const wpToUpdate: Waypoint = waypoints.find((elt: Waypoint) => elt.id === wp.id);
        wpToUpdate.description = wp.description;
        wpToUpdate.lat = wp.lat;
        wpToUpdate.lng = wp.lng;
        wpToUpdate.name = wp.name;

        return [waypoints, wp];
      }),
      tap(([waypoints]:  [Waypoint[]]) => this.electronService.fs.writeFileSync(
        this.filePath + '/' + this.waypointsFileName,
        JSON.stringify(this.serializer.serialize(waypoints))
      )),
      map(([waypoints, wp]:  [Waypoint[], Waypoint]) => wp)
    );
  }

  public delete(waypoint: Waypoint): Observable<any> {
    return combineLatest(this.findAll(), of(waypoint)).pipe(
      map(([waypoints, wp]:  [Waypoint[], Waypoint]) =>  {
        waypoints.slice(waypoints.findIndex((elt: Waypoint) => elt.id === wp.id), 1);

        return waypoints;
      }),
      tap((waypoints:  Waypoint[]) => this.electronService.fs.writeFileSync(
        this.filePath + '/' + this.waypointsFileName,
        JSON.stringify(this.serializer.serialize(waypoints))
      )),
      mergeMap(() => EMPTY)
    );
  }
}
