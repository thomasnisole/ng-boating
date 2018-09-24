import {Component, OnDestroy, OnInit} from '@angular/core';
import {Port} from '../../../core/model/port.model';
import {GpsService} from '../../../core/service/gps.service';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';
import {environment} from '../../../../../environments/environment';
import {EMPTY, Observable, of, Subscription} from 'rxjs/index';
import {TranslateService} from '@ngx-translate/core';
import {catchError, map, mergeMap, tap} from 'rxjs/internal/operators';
import {UserPreferences} from '../../../core/model/user-preferences.model';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {

  private userPreferenceSubscription: Subscription;

  public userPreferences: UserPreferences;

  public ports$: Observable<Port[]>;

  public baudRates: number[] = [];

  public logs: string[] = [];

  private openSubscription: Subscription;

  private getDataSubscription: Subscription;

  public constructor(
    private gpsService: GpsService,
    private userPreferencesService: UserPreferencesService,
    private translateService: TranslateService) {
    this.baudRates = environment.baudRates;
  }

  public ngOnInit(): void {
    this.userPreferenceSubscription = this.userPreferencesService
      .find()
      .subscribe((userPreferences: UserPreferences) => {
        this.userPreferences = userPreferences;

        this.refresh();
      });
  }

  public refresh(): void {
    this.ports$ = this.gpsService.findAllPorts().pipe(
      mergeMap((ports: Port[]) => {
        if (ports.length > 1 || ports.length < 1) {
          return of(ports);
        }

        if (ports[0].name === this.userPreferences.port) {
          return of(ports);
        }

        this.userPreferences.port = ports[0].name;

        return this.userPreferencesService.update(this.userPreferences).pipe(map(() => ports));
      }),
      tap(() => {
        if (this.userPreferences.port) {
          this.connect();
        }
      }),
      catchError((err) => {
        console.error(err);
        this.logs.push(err);

        return EMPTY;
      })
    );
  }

  public ngOnDestroy(): void {
    if (this.userPreferenceSubscription) {
      this.userPreferenceSubscription.unsubscribe();
    }

    if (this.openSubscription) {
      this.openSubscription.unsubscribe();
    }

    if (this.getDataSubscription) {
      this.getDataSubscription.unsubscribe();
    }
  }

  public onPortChange(): void {
    this.userPreferencesService.update(this.userPreferences);

    this.connect();
  }

  public onBaudRateChange(): void {
    this.userPreferencesService.update(this.userPreferences);

    this.connect();
  }

  private connect(): void {
    if (!this.userPreferences.baudRate) {
      return;
    }

    if (!this.userPreferences.port) {
      return;
    }

    this.openSubscription = this.gpsService.open(this.userPreferences.baudRate, this.userPreferences.port).subscribe(
      () => {
        this.logs.push(
          this.translateService.instant('settings.tracker.label.connected-on-port') + this.userPreferences.port
        );
        this.getDataSubscription = this.gpsService.data$.subscribe(
          (line) => this.logs.push(line)
        );
      },
      (err) => {
        this.logs.push(err);
      }
    );
  }
}
