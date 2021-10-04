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
import {EditDeskModalComponent} from './edit-desk-modal.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';
import {By} from '@angular/platform-browser';
import {DeskValidator} from 'src/app/utilities/form-validators/desk-validator';

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

class DeskValidatorMock {
  // tslint:disable-next-line: no-identical-functions
  public notUniqueDeskName(desks: any): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }
}

describe('EditDeskModalComponent', () => {
  let component: EditDeskModalComponent;
  let fixture: ComponentFixture<EditDeskModalComponent>;

  const ids = {
    saveButton: '#edit-or-add-desk-save-button',
    cancelButton: '#edit-or-add-desk-cancel-button',
    errorField: '#error-desk-name-field-is-required',
    deskName: '#deskName'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        ReactiveFormsModule
      ],
      declarations: [EditDeskModalComponent],
      providers: [
        {
          provide: FormValidator,
          useClass: FormValidatorMock
        },
        {
          provide: DeskValidator,
          useClass: DeskValidatorMock
        },
        {
          provide: 'desks',
          useValue: 'desks'
        },
        {
          provide: 'title',
          useValue: 'Title'
        },
        {
          provide: 'deskName',
          useValue: 'deskName'
        },
        {
          provide: 'deskId',
          useValue: 'deskId'
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditDeskModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be able to see deskName input field', () => {
    const deskNameInput = fixture.debugElement.query(By.css(ids.deskName));

    expect(deskNameInput).toBeTruthy();
  });

  it('form should have a deskName control', () => {
    const deskNameControl = component.deskForm.contains('deskName');

    expect(deskNameControl).toBe(true);
  });

  describe('if deskName is empty', () => {
    it('form should be invalid', () => {
      component.deskForm.controls.deskName.setValue('');
      fixture.detectChanges();

      const deskFormValidity = component.deskForm.valid;

      expect(deskFormValidity).toBeFalsy();
    });

    it('save button should be disabled', () => {
      const saveButtonInAddNewDesk = fixture.debugElement.query(By.css(ids.saveButton));

      expect(saveButtonInAddNewDesk.nativeElement.getAttribute('disabled')).toBeNull();
    });
  });

  describe('if deskName is filled in', () => {
    it('I should be able to save the form', () => {
      component.deskForm.controls.deskName.setValue('New desk');

      fixture.detectChanges();

      const saveButtonInAddNewDesk = fixture.debugElement.query(By.css(ids.saveButton));

      expect(saveButtonInAddNewDesk.nativeElement.getAttribute('disabled')).toBeNull();
    });
  });
});
