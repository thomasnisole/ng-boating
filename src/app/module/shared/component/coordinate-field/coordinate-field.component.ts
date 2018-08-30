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

  public degrees: string;

  public minutes: string;

  public decimal: string;

  public cardinality: string;

  public orientations: string[][] = [
    ['N', 'S'],
    ['E', 'W']
  ];

  public constructor() { }

  public ngOnInit(): void {
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

  public onCoordinateChange(): void {
    try {
      if (this.coordToDisplay === 0) {
        this.coordChange.emit(
          parseDMS(this.degrees + '° ' + this.minutes + '.' + this.decimal + '\' ' + this.cardinality).lat
        );
      } else {
        this.coordChange.emit(
          parseDMS(this.degrees + '° ' + this.minutes + '.' + this.decimal + '\' ' + this.cardinality).lon
        );
      }
    } catch (err) {

    }
  }
}
