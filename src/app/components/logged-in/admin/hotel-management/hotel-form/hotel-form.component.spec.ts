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
import {HotelFormComponent} from './hotel-form.component';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';
import {ModalService} from 'carbon-components-angular';
import {By} from '@angular/platform-browser';

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

  // tslint:disable-next-line:no-identical-functions
  public forbiddenCharactersId(): ValidatorFn {
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

describe('HotelFormComponent', () => {
  let component: HotelFormComponent;
  let fixture: ComponentFixture<HotelFormComponent>;

  beforeEach(async () => {
    const modalServiceMock = jasmine.createSpyObj('ModalService', ['create', 'destroy']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule
      ],
      declarations: [HotelFormComponent],
      providers: [
        {
          provide: FormValidator,
          useClass: FormValidatorMock
        },
        {
          provide: ModalService,
          useValue: modalServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be able to see the hotel id field', () => {
    const hotelIdInput = fixture.debugElement.query(By.css('#hotelId'));

    expect(hotelIdInput).toBeTruthy();
  });

  it('I should be able to see the hotel name field', () => {
    const hotelNameInput = fixture.debugElement.query(By.css('#hotelName'));

    expect(hotelNameInput).toBeTruthy();
  });

  it('if the form is not empty, save button should be disabled', () => {
    const submitButton = fixture.debugElement.query(By.css('#submit-button'));

    expect(submitButton.nativeElement.getAttribute('disabled')).toEqual('');
  });

  it('discard event should emit after clicking the discard button', () => {
    const discardEmitterSpy = spyOn(component['discardForm'], 'emit');
    const discardButton = fixture.debugElement.query(By.css('#discard-button')).nativeElement;

    discardButton.click();

    expect(discardEmitterSpy).toHaveBeenCalledTimes(1);
  });

  describe ('If the form is filled with the valid hotel details', () => {
    it('submit event should emit after clicking the submit button', () => {
      component.hotelForm.get('id')!.setValue('id-123');
      component.hotelForm.get('name')!.setValue('Bee Hotel');
      component.hotelForm.get('address.street')!.setValue('Summer Street');
      component.hotelForm.get('address.houseNumber')!.setValue('12');
      component.hotelForm.get('address.postalCode')!.setValue('8090');
      component.hotelForm.get('address.city')!.setValue('Bee city');

      fixture.detectChanges();

      const submitEmitterSpy = spyOn(component['submitForm'], 'emit');
      const submitButton = fixture.debugElement.query(By.css('#submit-button')).nativeElement;

      submitButton.click();

      expect(submitEmitterSpy).toHaveBeenCalledTimes(1);
    });
  });
});
