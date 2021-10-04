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

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {BookingSearchComponent} from './booking-search.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';

class FormValidatorMock {
  public isFormControlInvalidAfterTouch(formControl: any): boolean {
    return false;
  }

  public requiredNoWhitespace(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  // tslint:disable-next-line:no-identical-functions
  public requiredNoWhitespaceFill(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  // tslint:disable-next-line:no-identical-functions
  public forbiddenCharactersString(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  public getSanitizedFormStringValue(control: any): any {
    return control.value;
  }

  public getSanitizedRawFormValues(form: any): any {
    return form.getRawValue();
  }
}

describe('BookingSearchComponent', () => {
  let component: BookingSearchComponent;
  let fixture: ComponentFixture<BookingSearchComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingSearchComponent],
      imports: [
        RouterTestingModule,
        HttpClientTestingModule,
        ReactiveFormsModule
      ],
      providers: [
        {
          provide: FormValidator,
          useClass: FormValidatorMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  it('search form should consist of booking number field', () => {
    const searchForm = component.searchForm;

    expect(searchForm.contains('bookingNumber')).toBeTrue();
  });

  it('if the booking number is empty, search form should be invalid', () => {
    expect(component.searchForm.valid).toBeFalse();
  });

  it('if the booking number is not empty, search form should be valid', () => {
    component.searchForm.get('bookingNumber')!.setValue('123');

    expect(component.searchForm.valid).toBeTrue();
  });

  it('if I fill the booking number, search value should be updated', () => {
    const emitSpy = spyOn(component.searchString, 'emit');
    component.searchForm.get('bookingNumber')!.setValue('123');

    component.emitSearchString();
    fixture.detectChanges();

    expect(emitSpy).toHaveBeenCalledWith('123');
  });
});
