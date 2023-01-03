import { ValidatorFn, AbstractControl } from '@angular/forms';

export default class CustomValidators {

  static url: ValidatorFn = (control: AbstractControl) => {
    try {
      new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }
}
