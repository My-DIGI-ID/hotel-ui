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
import {UserFormComponent} from './user-form.component';
import {By} from '@angular/platform-browser';
import {FormValidator} from '../../../../../utilities/form-validators/form-validator';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {DropdownModule, ComboBoxModule} from 'carbon-components-angular';

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
  public forbiddenCharactersId(): ValidatorFn {
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
  public forbiddenCharactersPassword(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  // tslint:disable-next-line:no-identical-functions
  public requiredStrongPassword(): ValidatorFn {
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

describe('UserFormComponent', () => {
  let component: UserFormComponent;
  let fixture: ComponentFixture<UserFormComponent>;
  const validPassword = 'Password0!';
  const validHotel = {
    content: 'IBM Hotel',
    id: 'hotel-1',
    selected: true
  };
  const validUserDetails = {
    login: 'max.smith',
    firstName: 'Max',
    lastName: 'Smith',
    email: 'max.smith@hotel.de',
    hotelId: validHotel.id,
    password: validPassword
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        DropdownModule,
        ComboBoxModule
      ],
      declarations: [UserFormComponent],
      providers: [
        {
          provide: FormValidator,
          useClass: FormValidatorMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be able to see the username field', () => {
    const usernameInput = fixture.debugElement.query(By.css('#login'));

    expect(usernameInput).toBeTruthy();
  });

  it('I should be able to see the first name field', () => {
    const firstNameInput = fixture.debugElement.query(By.css('#firstName'));

    expect(firstNameInput).toBeTruthy();
  });

  it('I should be able to see the last name field', () => {
    const lastNameInput = fixture.debugElement.query(By.css('#lastName'));

    expect(lastNameInput).toBeTruthy();
  });

  it('I should be able to see the email field', () => {
    const emailInput = fixture.debugElement.query(By.css('#email'));

    expect(emailInput).toBeTruthy();
  });

  it('I should be able to see the password field', () => {
    const passwordInput = fixture.debugElement.query(By.css('#password'));

    expect(passwordInput).toBeTruthy();
  });

  it('I should be able to see the hotel name field', () => {
    const hotelNameInput = fixture.debugElement.query(By.css('#hotelName'));

    expect(hotelNameInput).toBeTruthy();
  });

  it('I should not be able to click the Save button if the form is not filled in', () => {
    const submitButton = fixture.debugElement.query(By.css('#submit-button'));

    expect(submitButton.nativeElement.getAttribute('disabled')).toEqual('');
  });

  it('discard event should emit after clicking the discard button', () => {
    const discardEmitterSpy = spyOn(component['discardForm'], 'emit');
    const discardButton = fixture.debugElement.query(By.css('#discard-button')).nativeElement;

    discardButton.click();

    expect(discardEmitterSpy).toHaveBeenCalledTimes(1);
  });

  describe('If the form is filled in with the valid user details', () => {
    beforeEach(() => {
      component.userForm.controls.login.setValue(validUserDetails.login);
      component.userForm.controls.firstName.setValue(validUserDetails.firstName);
      component.userForm.controls.lastName.setValue(validUserDetails.lastName);
      component.userForm.controls.email.setValue(validUserDetails.email);
      component.userForm.controls.password.setValue(validUserDetails.password);
      component.userForm.controls.hotel.setValue(validHotel);

      fixture.detectChanges();
    });

    it('submit event should emit after clicking the submit button', () => {
      const submitEmitterSpy = spyOn(component['submitForm'], 'emit');
      const submitButton = fixture.debugElement.query(By.css('#submit-button')).nativeElement;

      submitButton.click();

      expect(submitEmitterSpy).toHaveBeenCalledTimes(1);
    });
  });
});
