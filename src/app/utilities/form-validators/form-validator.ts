/*
 * Copyright 2021 Bundesrepublik Deutschland
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AbstractControl, FormControl, FormGroup, ValidatorFn} from '@angular/forms';
import {Injectable} from '@angular/core';

@Injectable()
export class FormValidator {
  public isFormControlInvalidAfterTouch(formControl: FormControl | AbstractControl): boolean {
    return formControl.touched && formControl.invalid;
  }

  public forbiddenCharactersString(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const whitelistedCharacters = new RegExp(/[^\sa-z0-9_.&äáâàăçéëêèïíììñóöôòøöșțüúüûùßẞ-]/gi);

      if (whitelistedCharacters.test(control.value)) {
        return {fieldContainsForbiddenCharacters: true};
      }

      return null;
    };
  }

  public forbiddenCharactersId(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const whitelistedCharacters = new RegExp(/[^a-z0-9_.äöüßẞ-]/gi);

      if (whitelistedCharacters.test(control.value)) {
        return {idContainsForbiddenCharacters: true};
      }

      return null;
    };
  }

  public forbiddenCharactersPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const whitelistedCharacters = new RegExp(/[^a-z0-9_!@#$%^&*()-.?]/gi);

      if (whitelistedCharacters.test(control.value)) {
        return {passwordContainsForbiddenCharacters: true};
      }

      return null;
    };
  }

  public requiredStrongPassword(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const strongPasswordRequirements = new RegExp(/(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[_!@#$%^&*()-.?])/g);

      if (!strongPasswordRequirements.test(control.value)) {
        return {weakPassword: true};
      }

      return null;
    };
  }

  public requiredNoWhitespace(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      const forbiddenCharactersRegex = new RegExp(/\s/g);

      if (forbiddenCharactersRegex.test(control.value)) {
        return {containsWhitespace: true};
      }

      return null;
    };
  }

  public requiredNoWhitespaceFill(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } | null => {
      if (control.value == null || control.value.length === 0 || control.value.trim() === '') {
        return {required: true};
      }

      return null;
    };
  }

  public getSanitizedFormStringValue(control: AbstractControl): any {
    return this.sanitizeFormStringValue(control.value);
  }

  public getSanitizedRawFormValues(form: FormGroup): any {
    return this.sanitizeRawFormValues(form.getRawValue());
  }

  private sanitizeFormStringValue(value: string): string {
    return value.trim();
  }

  private sanitizeRawFormValues(rawFormValues: any): any {
    Object.keys(rawFormValues).forEach((key) => {
      if (typeof rawFormValues[key] === 'string') {
        rawFormValues[key] = this.sanitizeFormStringValue(rawFormValues[key]);
      } else if (Array.isArray(rawFormValues[key])) {
        rawFormValues[key].forEach((element: any) => this.sanitizeRawFormValues(element));
      }
    });

    return rawFormValues;
  }
}
