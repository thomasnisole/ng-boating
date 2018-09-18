import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import * as formatcoords from 'formatcoords';
import * as parseDMS from 'parse-dms';
import * as leftPad from 'left-pad';

@Component({
  selector: 'app-coordinate-field',
  templateUrl: './coordinate-field.component.html',
  styleUrls: ['./coordinate-field.component.scss']
})
export class CoordinateFieldComponent implements OnInit {

  @Input()
  public coordToDisplay: number = null;

  @Output()
  public coordChange: EventEmitter<string> = new EventEmitter();

  @Input()
  public maxDegrees: number = 0;

  public degrees: string = null;

  public minutes: string = null;

  public decimal: string = null;

  public cardinality: string;

  public orientations: string[][] = [
    ['N', 'S'],
    ['E', 'W']
  ];

  public constructor() { }

  public ngOnInit(): void {
    if (this.coordToDisplay === 0) {
      this.cardinality = 'N';
    } else {
      this.cardinality = 'W';
    }
  }

  @Input()
  public set coordinates(value: any) {
    if (this.coordToDisplay === null) {
      return;
    }

    if (!value.lat || !value.lng) {
      return;
    }

    const coord: string = formatcoords(value)
      .format(
        'Ff',
        {
          latLonSeparator: 'sep',
          decimalPlaces: 4
        }
      )
      .replace(/\d{1,3}[°]/g, (found: string) => leftPad(found, 4, '0'))
      .replace(/\d{1,2}[.]/g, (found: string) => leftPad(found, 3, '0'))
      .split('sep')[this.coordToDisplay];

    const degreesSep: string[] = coord.split('° ');
    this.degrees = degreesSep[0];

    const minutesSep: string[] = degreesSep[1].split('.');
    this.minutes = minutesSep[0];

    const decimalSep: string[] = minutesSep[1].split('′ ');
    this.decimal = decimalSep[0];
    this.cardinality = decimalSep[1];
  }

  public onDegreesChange(): void {
    if (parseInt(this.degrees, 10) > this.maxDegrees) {
      this.degrees = this.maxDegrees.toString();
    }

    this.degrees = leftPad(this.degrees, 3, '0');

    this.onCoordinateChange();
  }

  public onMinutesChange(): void {
    if (parseInt(this.minutes, 10) > 60) {
      this.minutes = '60';
    }

    this.minutes = leftPad(this.minutes, 2, '0');

    this.onCoordinateChange();
  }

  public onDecimalChange(): void {
    if (parseInt(this.decimal, 10) > 9999) {
      this.decimal = '9999';
    }

    this.onCoordinateChange();
  }

  private onCoordinateChange(): void {
    try {
      let coord: string = '';

      if (this.degrees === null) {
        coord += '0';
      } else {
        coord += this.degrees;
      }
      coord += '° ';

      if (this.minutes === null) {
        coord += '0';
      } else {
        coord += this.minutes;
      }
      coord += '.';

      if (this.decimal === null) {
        coord += '0';
      } else {
        coord += this.decimal;
      }

      coord += '\' ' + this.cardinality;

      if (this.coordToDisplay === 0) {
        this.coordChange.emit(parseDMS(coord).lat);
      } else {
        this.coordChange.emit(parseDMS(coord).lon);
      }
    } catch (err) {
      console.warn(err);
    }
  }
}
