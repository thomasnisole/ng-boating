import {Component, forwardRef, OnInit} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {isUndefined} from 'util';

@Component({
  selector: 'app-latitude-field',
  templateUrl: './latitude-field.component.html',
  styleUrls: ['./latitude-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LatitudeFieldComponent),
      multi: true
    }
  ]
})
export class LatitudeFieldComponent implements OnInit, ControlValueAccessor {

  public latitude: string;

  public constructor() {
  }

  public ngOnInit() {
  }

  public onCoordinateChange($event): void {
    this.writeValue($event);
  }

  public onChange: (_: any) => void = (_: any) => {};

  public onTouched: () => void = () => {};

  public updateChanges() {
    this.onChange(this.latitude);
  }

  public writeValue(value: any): void {
    const previousValue = this.latitude;

    if (value !== this.latitude) {
      this.latitude = value;
    }

    if (previousValue !== null) {
      this.updateChanges();
    }
  }

  public registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  public registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
}
