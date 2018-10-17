import {Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {UserPreferencesService} from '../../../core/service/user-preferences.service';
import {GSVPacket} from 'nmea-simple';
import {Satellite} from 'nmea-simple/dist/codecs/GSV';
import {Router} from '@angular/router';
import {Subscription} from 'rxjs/index';
import * as leftPad from 'left-pad';

const CHART_MARGIN_TOP: number      = 20;
const CHART_MARGIN_BOTTOM: number   = 20;
const RECT_SATELLITE_SPACE: number  = 10;
const CHART_FONT_SIZE: number       = 15;

@Component({
  selector: 'app-satellites-view',
  templateUrl: './satellites-view.component.html',
  styleUrls: ['./satellites-view.component.scss']
})
export class SatellitesViewComponent implements OnInit, OnDestroy {

  private chartHeight: number;

  private width: number;

  private height: number;

  private subscription: Subscription;

  public gsvPacket: GSVPacket;

  public satellites: Satellite[] = [];

  @ViewChild('canvas')
  public canvas: ElementRef;

  public constructor(
    private userPreferencesService: UserPreferencesService,
    private gpsService: GpsService,
    private router: Router) {
  }

  public ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  public ngOnInit() {
    this.width = this.canvas.nativeElement.scrollWidth;
    this.height = this.canvas.nativeElement.scrollHeight;

    (<HTMLCanvasElement>this.canvas.nativeElement).width = this.width;
    (<HTMLCanvasElement>this.canvas.nativeElement).height = this.height;

    this.drawArea();
    this.drawDashedLine();

    this.subscription = this.gpsService.getGPGSV().subscribe(
      (gsvData: GSVPacket) => {
        console.log(gsvData);
        this.gsvPacket = gsvData;

        if (this.gsvPacket.messageNumber === 1) {
          this.satellites.splice(0, this.satellites.length);
        }

        this.gsvPacket.satellites.forEach((s: Satellite) => {
          this.satellites.push(s);
        });

        if (this.gsvPacket.messageNumber === this.gsvPacket.numberOfMessages) {
          this.drawArea();
          this.drawDashedLine();
          this.drawSNRChart();
        }
      },
      (err: Error) => {
        console.log(err);
      }
    );
  }

  private drawArea(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');
    this.chartHeight = this.height - CHART_MARGIN_TOP - CHART_MARGIN_BOTTOM;

    ctx.clearRect(0, 0, this.width, this.height);

    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, this.width, this.chartHeight + CHART_MARGIN_TOP + 1);
  }

  private drawDashedLine(): void {
    const ctx = this.canvas.nativeElement.getContext('2d');

    ctx.setLineDash([0]);
    ctx.lineWidth = 1;

    ctx.strokeStyle = '#fff';

    ctx.beginPath();
    ctx.moveTo(0, CHART_MARGIN_TOP + 1);
    ctx.lineTo(this.width, CHART_MARGIN_TOP + 1);
    ctx.stroke();
    ctx.closePath();

    ctx.setLineDash([5]);

    ctx.beginPath();
    ctx.moveTo(0, this.chartHeight / 2 + CHART_MARGIN_TOP);
    ctx.lineTo(this.width, this.chartHeight / 2 + CHART_MARGIN_TOP);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, (this.chartHeight / 10) * 7 + CHART_MARGIN_TOP + 1);
    ctx.lineTo(this.width, (this.chartHeight / 10) * 7 + CHART_MARGIN_TOP + 1);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, (this.chartHeight / 10) * 8 + CHART_MARGIN_TOP + 1);
    ctx.lineTo(this.width, (this.chartHeight / 10) * 8 + CHART_MARGIN_TOP + 1);
    ctx.stroke();
    ctx.closePath();

    ctx.beginPath();
    ctx.moveTo(0, (this.chartHeight / 10) * 9 + CHART_MARGIN_TOP + 1);
    ctx.lineTo(this.width, (this.chartHeight / 10) * 9 + CHART_MARGIN_TOP + 1);
    ctx.stroke();
    ctx.closePath();
  }

  private drawSNRChart(): void {
    const fontSize: number = 20;
    const colors: string[] = ['#00ff01', '#daff01', '#fefe05', '#ff7e02', '#fe0000'];
    const space: number = 10;

    const satellitesCount: number = this.satellites.length;
    const widthAvailable: number = this.width - ((satellitesCount - 1) * space);
    const satelliteWidth: number = widthAvailable / satellitesCount;
    let currentX: number = 0;

    this.satellites.forEach((satellite: Satellite) => {
      const ctx = this.canvas.nativeElement.getContext('2d');

      let color: string = '';
      if (satellite.SNRdB >= 50) {
        color = colors[0];
      } else if (satellite.SNRdB < 50 && satellite.SNRdB >= 30) {
        color = colors[1];
      } else if (satellite.SNRdB < 30 && satellite.SNRdB >= 20) {
        color = colors[2];
      } else if (satellite.SNRdB < 20 && satellite.SNRdB >= 10) {
        color = colors[3];
      } else if (satellite.SNRdB < 10) {
        color = colors[4];
      }

      const satelliteHeight: number = (this.chartHeight + 1) * satellite.SNRdB / 99;
      ctx.fillStyle = color;
      ctx.fillRect(
        currentX,
        this.chartHeight - satelliteHeight + CHART_MARGIN_TOP + 1,
        satelliteWidth,
        satelliteHeight
      );

      ctx.fillStyle = '#fff';
      ctx.textAlign = 'center';
      ctx.font = CHART_FONT_SIZE + 'px Arial';
      ctx.fillText(
        leftPad(satellite.prnNumber, 2, '0'),
        currentX + satelliteWidth / 2,
        this.chartHeight + CHART_MARGIN_TOP + CHART_FONT_SIZE
      );

      if (satellite.SNRdB > 0) {
        ctx.fillText(
          leftPad(satellite.SNRdB, 2, '0'),
          currentX + satelliteWidth / 2,
          this.chartHeight - satelliteHeight + CHART_MARGIN_TOP
        );
      }

      currentX = currentX + satelliteWidth + space;
    });
  }

  public onSwipe($event): void {
    switch ($event.direction) {
      case 2:
        this.router.navigate(['app', 'gps', 'main']);
        break;
    }
  }
}
