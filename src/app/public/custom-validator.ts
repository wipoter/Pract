import { AbstractControl, ValidationErrors } from "@angular/forms";

export class CustomValidators {
  static passwordsMatching(control: AbstractControl): ValidationErrors | null {
    const password = control.get('password')?.value;
    const passwordConfirm = control.get('passwordConfirm')?.value;

    if ((password === passwordConfirm) && (password !== null && passwordConfirm !== null)) {
      return null;
    } else {
      return { passwordsNotMatching: true };
    }
  }

  static passwordsNewMatching(control: AbstractControl): ValidationErrors | null {
    const passwordNew1 = control.get('passwordNew1')?.value;
    const passwordNew2 = control.get('passwordNew2')?.value;

    if ((passwordNew1 === passwordNew2) && (passwordNew1 !== null && passwordNew2 !== null)) {
      return null;
    } else {
      return { passwordsNotMatching: true };
    }
  }

}