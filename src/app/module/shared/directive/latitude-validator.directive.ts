import {Directive, forwardRef} from '@angular/core';
import {AbstractControl, NG_VALIDATORS, ValidationErrors, Validator} from '@angular/forms';

console.log('heho');

@Directive({
  selector: '[appLatitudeValidator]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => LatitudeValidatorDirective),
      multi: true
    }
  ]
})
export class LatitudeValidatorDirective implements Validator {

  public constructor() {
    console.log('connard');
  }

  public validate(c: AbstractControl): ValidationErrors | any {
    console.log(c);
    return {'latitude': 'bad latitude'};
  }
}
