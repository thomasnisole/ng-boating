import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject, EMPTY, iif, Observable} from 'rxjs/index';
import {filter, finalize, map} from 'rxjs/internal/operators';
import {Packet, parseNmeaSentence} from 'nmea-simple';

@Injectable()
export class NmeaClientService {

  private connected: boolean = false;

  private subjectConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private subjectOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private subjectError: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private packets: Observable<Packet|string>[] = [];

  private counters: number[] = [];

  public connected$: Observable<boolean> = EMPTY;

  public open$: Observable<boolean> = EMPTY;

  public error$: Observable<string> = EMPTY;

  public constructor(private socket: Socket) {
    this.connected$ = this.subjectConnected;
    this.open$ = this.subjectOpen;
    this.error$ = this.subjectError.pipe(
      filter((err) => !!err)
    );

    this.socket.on('disconnect', (reason) => {
      this.subjectError.next(reason);
      this.connected = false;
      this.subjectConnected.next(false);
    });
    this.socket.on('connect', () => {
      this.connected = true;
      this.subjectConnected.next(true);
      this.subjectOpen.next(false);
    });

    this.socket.on('closePort', () => {
      this.subjectOpen.next(false);
    });
  }

  public open(baudRate: number, port: string): Observable<boolean> {
    this.socket.emit(
      'openPort',
      {baudRate: baudRate, port: port},
      (err) => {
        if (err) {
          this.subjectError.next(err);
          this.subjectOpen.next(false);
        } else {
          this.subjectOpen.next(true);
        }
      }
    );

    return this.open$;
  }

  public close(): void {
    this.socket.emit('close', (err) => {
      if (err) {
        this.subjectError.next(err);
      } else {
        this.subjectOpen.next(false);
      }
    });
  }

  public getSubject(sentenceType: string): Observable<Packet|string> {
    if (!this.packets[sentenceType]) {
      const subject: BehaviorSubject<string> = new BehaviorSubject<string>('');
      this.packets[sentenceType] = subject.pipe(
        filter(() => this.connected),
        filter((line: string) => line != null),
        filter((line: string) => line !== ''),
        map((line: string) => sentenceType !== 'ALL' ? parseNmeaSentence(line) : line),
        finalize(() => {
          this.counters[sentenceType]--;
          if (this.counters[sentenceType] === 0) {
            this.socket.removeListener('/nmea/' + sentenceType);
            this.packets[sentenceType] = null;
          }
        })
      );

      this.socket.on('/nmea/' + sentenceType, (line: string) => subject.next(line));
      this.counters[sentenceType] = 0;
    }

    this.counters[sentenceType]++;

    return this.packets[sentenceType];
  }
}
