import {Injectable} from '@angular/core';
import {Socket} from 'ngx-socket-io';
import {BehaviorSubject, EMPTY, Observable} from 'rxjs/index';
import {filter, tap} from 'rxjs/internal/operators';

@Injectable()
export class NmeaServerService {

  private connected: boolean = false;

  private subjectConnected: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private subjectOpen: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  private subjectData: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  private subjectError: BehaviorSubject<string> = new BehaviorSubject<string>(null);

  public connected$: Observable<boolean> = EMPTY;

  public open$: Observable<boolean> = EMPTY;

  public data$: Observable<string> = EMPTY;

  public error$: Observable<string> = EMPTY;

  public constructor(private socket: Socket) {
    this.connected$ = this.subjectConnected;
    this.open$ = this.subjectOpen;
    this.data$ = this.subjectData.pipe(
      filter(() => this.connected),
      filter((line: string) => line != null)
    );
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

    this.socket.on('data', (line: string) => {
      this.subjectData.next(line);
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
}
