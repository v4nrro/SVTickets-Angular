import { AbstractControl, FormControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function sameValueValidator(otherControl: FormControl): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (control?.value !== otherControl.value) {
      return { sameValue: true };
    }

    return null; // No errors
  }
}