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
import {AddUserComponent} from './add-user.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {HotelService} from 'src/app/services/hotel/hotel.service';
import {DropdownModule, GridModule, ListItem, ComboBoxModule, NotificationService} from 'carbon-components-angular';
import {UserService} from 'src/app/services/user/user.service';
import {Router} from '@angular/router';
import {UserFormComponent} from '../user-form/user-form.component';
import {FormValidator} from '../../../../../utilities/form-validators/form-validator';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {Component} from '@angular/core';
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

@Component({
  selector: 'app-user-form-mock-component',
  template: '',
  providers: [
    {
      provide: UserFormComponent,
      useClass: UserFormMockComponent
    }
  ]
})
class UserFormMockComponent {
  public hotels: ListItem[] = [];
}

describe('AddEmployeeComponent', () => {
  let component: AddUserComponent;
  let fixture: ComponentFixture<AddUserComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const userServiceMock = jasmine.createSpyObj('UserService', ['createUser']);
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const hotelServiceMock = {
      getAllHotels: async (): Promise<any[]> => {
        return [
          {
            id: 'hotel-1',
            name: 'IBM Hotel',
            desks: [
              {
                id: 'desk1',
                name: 'Blue Desk'
              },
              {
                id: 'desk2',
                name: 'Red Desk'
              },
              {
                id: 'desk3',
                name: 'Yellow Desk'
              },
              {
                id: 'desk4',
                name: 'Green Desk'
              }
            ]
          }
        ];
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        ReactiveFormsModule,
        DropdownModule,
        GridModule,
        ComboBoxModule
      ],
      declarations: [
        AddUserComponent,
        UserFormComponent
      ],
      providers: [
        {
          provide: FormValidator,
          useClass: FormValidatorMock
        },
        {
          provide: HotelService,
          useValue: hotelServiceMock
        },
        {
          provide: UserService,
          useValue: userServiceMock
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddUserComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be redirected to the user management page once the save was successful', async () => {
    spyOnProperty(component['userFormComponent']!.userForm, 'valid', 'get').and.returnValue(true);

    await component.submitAddUser();

    expect(router.navigateByUrl).toHaveBeenCalledWith('admin/user-management');
  });

  it('I should be redirected to the user management page after discarding the form', () => {
    component.discard();

    expect(router.navigateByUrl).toHaveBeenCalledWith('admin/user-management');
  });

  describe('if submit fails with an error', () => {
    beforeEach(async () => {
      spyOnProperty(component['userFormComponent']!.userForm, 'valid', 'get').and.returnValue(true);
      component['userService'].createUser = jasmine.createSpy().and.throwError('400');

      await component.submitAddUser();
      fixture.detectChanges();
    });

    it('I should not be redirected', () => {
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });

    it('I should be able to see error notification', () => {
      expect(component['notificationService'].showNotification).toHaveBeenCalledTimes(1);
    });
  });
});
