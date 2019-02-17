import { Component, OnInit } from '@angular/core';
import {GpsService} from '../../../core/service/gps.service';
import {Router} from '@angular/router';
import {GGAPacket, GLLPacket, GSAPacket, GSVPacket, Packet, RMCPacket, VTGPacket} from 'nmea-simple';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-debug-nmea',
  templateUrl: './debug-nmea.component.html',
  styleUrls: ['./debug-nmea.component.scss']
})
export class DebugNmeaComponent implements OnInit {

  public currentGGAPacket$: Observable<GGAPacket>;

  public currentGLLPacket$: Observable<GLLPacket>;

  public currentGSAPacket$: Observable<GSAPacket>;

  public currentGSVPacket$: Observable<GSVPacket>;

  public currentVTGPacket$: Observable<VTGPacket>;

  public currentRMCPacket$: Observable<RMCPacket>;

  public constructor(private gpsService: GpsService, private router: Router) { }

  public ngOnInit(): void {
    this.currentGGAPacket$ = this.gpsService.getGPGGA();
    this.currentGLLPacket$ = this.gpsService.getGPGLL();
    this.currentGSAPacket$ = this.gpsService.getGPGSA();
    this.currentGSVPacket$ = this.gpsService.getGPGSV();
    this.currentVTGPacket$ = this.gpsService.getGPVTG();
    this.currentRMCPacket$ = this.gpsService.getGPRMC();
  }

  public onClick(): void {
    this.router.navigate(['app', 'gps', 'satellites']);
  }

  public getKeys(packet: Packet): string[] {
    return Object.keys(packet);
  }
}
