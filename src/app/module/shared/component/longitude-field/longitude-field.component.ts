import {Component, EventEmitter, forwardRef, Input, OnInit, Output} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';

@Component({
  selector: 'app-longitude-field',
  templateUrl: './longitude-field.component.html',
  styleUrls: ['./longitude-field.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => LongitudeFieldComponent),
      multi: true
    }
  ]
})
export class LongitudeFieldComponent implements OnInit, ControlValueAccessor {

  public longitude: string;

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
    this.onChange(this.longitude);
  }

  public writeValue(value: any): void {
    const previousValue = this.longitude;

    if (value !== this.longitude) {
      this.longitude = value;
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
