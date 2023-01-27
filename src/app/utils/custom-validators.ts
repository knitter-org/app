import { ValidatorFn, AbstractControl } from '@angular/forms';

export default class CustomValidators {

  static url: ValidatorFn = (control: AbstractControl) => {
    try {
      !!control.value && new URL(control.value);
      return null;
    } catch {
      return { invalidUrl: true };
    }
  }
}
