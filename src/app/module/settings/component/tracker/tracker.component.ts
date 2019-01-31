import {Component, OnDestroy, OnInit} from '@angular/core';
import {Port} from '../../../core/model/port.model';
import {GpsService} from '../../../core/service/gps.service';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';
import {environment} from '../../../../../environments/environment';
import {EMPTY, Observable, Subject} from 'rxjs';
import {catchError, defaultIfEmpty, map, tap} from 'rxjs/internal/operators';
import {UserPreferences} from '../../../core/model/user-preferences.model';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {

  public userPreferences$: Observable<UserPreferences>;

  public ports$: Observable<Port[]>;

  public baudRates: number[] = [];

  public logs: string[] = [];

  public logs$: Observable<string[]>;

  public constructor(private gpsService: GpsService, private userPreferencesService: UserPreferencesService) {
    this.baudRates = environment.baudRates;
    this.logs$ = new Subject<string[]>();
  }

  public ngOnInit(): void {
    this.userPreferences$ = this.userPreferencesService.find();
    this.ports$ = this.gpsService.findAllPorts().pipe(
      catchError((err) => {
        console.error(err);
        this.logs.push(err);

        return EMPTY;
      })
    );
    this.logs$ = this.gpsService.getAll().pipe(
      tap((line: string) => this.logs.push(line)),
      map(() => this.logs),
      defaultIfEmpty([])
    );
  }

  public ngOnDestroy(): void {
  }

  public onPortChange(userPreferences: UserPreferences): void {
    this.userPreferencesService.update(userPreferences);
  }

  public onBaudRateChange(userPreferences: UserPreferences): void {
    this.userPreferencesService.update(userPreferences);
  }

  public onRefresh(): void {

  }
}
