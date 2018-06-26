import {ChangeDetectorRef, Component, OnDestroy, OnInit} from '@angular/core';
import {Port} from '../../../core/model/port.model';
import {GpsService} from '../../../core/service/gps.service';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';
import {environment} from '../../../../../environments/environment';
import {Subscription} from 'rxjs/index';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-tracker',
  templateUrl: './tracker.component.html',
  styleUrls: ['./tracker.component.scss']
})
export class TrackerComponent implements OnInit, OnDestroy {

  public currentPort: string = null;

  public currentBaudRate: string = null;

  public ports: Port[];

  public baudRates: number[] = [];

  public logs: string[] = [];

  private findAllPortsSubscription: Subscription;

  private openSubscription: Subscription;

  private getDataSubscription: Subscription;

  public constructor(
    private gpsService: GpsService,
    private cdr: ChangeDetectorRef,
    private userPreferencesService: UserPreferencesService,
    private translateService: TranslateService) {
    this.baudRates = environment.baudRates;
    this.currentPort = this.userPreferencesService.preferences.port;
    this.currentBaudRate = this.userPreferencesService.preferences.baudRate.toString();
  }

  public ngOnInit(): void {
    this.refresh();
  }

  public ngOnDestroy(): void {
    if (this.findAllPortsSubscription) {
      this.findAllPortsSubscription.unsubscribe();
    }

    if (this.openSubscription) {
      this.openSubscription.unsubscribe();
    }

    if (this.getDataSubscription) {
      this.getDataSubscription.unsubscribe();
    }
  }

  public refresh(): void {
    this.ports = [];

    this.gpsService
      .findAllPorts()
      .subscribe(
        (ports: Port[]) => {
          this.ports = ports;

          if (ports.length === 1) {
            this.currentPort = ports[0].name;
            this.userPreferencesService.preferences.port = this.currentPort;
            this.userPreferencesService.save();
          }

          if (this.currentPort) {
            this.connect();
          }
        },
        (err) => {
          this.logs.push(err);
        }
      );
  }

  public onPortChange(): void {
    this.userPreferencesService.preferences.port = this.currentPort;
    this.userPreferencesService.save();

    this.connect();
  }

  public onBaudRateChange(): void {
    this.userPreferencesService.preferences.baudRate = parseInt(this.currentBaudRate, 10);
    this.userPreferencesService.save();

    this.connect();
  }

  private connect(): void {
    if (!this.currentBaudRate) {
      return;
    }

    if (!this.currentPort) {
      return;
    }

    this.openSubscription = this.gpsService.open(parseInt(this.currentBaudRate, 10), this.currentPort).subscribe(
      () => {
        this.logs.push(this.translateService.instant('settings.tracker.label.connected-on-port') + this.currentPort);
        this.getDataSubscription = this.gpsService.getDataAsString().subscribe(
          (line: string) => {
            this.logs.push(line);
            this.cdr.detectChanges();
          }
        );
      },
      (err) => {
        this.logs.push(err.name + ' : ' + err.message);

        console.log(this.logs);
      }
    );
  }
}
