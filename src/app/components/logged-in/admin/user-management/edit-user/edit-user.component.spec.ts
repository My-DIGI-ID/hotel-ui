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
import {EditUserComponent} from './edit-user.component';
import {By} from '@angular/platform-browser';
import {Component} from '@angular/core';
import {UserFormComponent} from '../user-form/user-form.component';
import {DropdownModule, GridModule, ListItem, ComboBoxModule, NotificationService} from 'carbon-components-angular';
import {ActivatedRoute, Router} from '@angular/router';
import {FormValidator} from '../../../../../utilities/form-validators/form-validator';
import {HotelService} from '../../../../../services/hotel/hotel.service';
import {UserService} from '../../../../../services/user/user.service';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';

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

describe('EditUserComponent', () => {
  let component: EditUserComponent;
  let fixture: ComponentFixture<EditUserComponent>;
  let router: Router;

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const userServiceMock = {
      getUser: async (id: string): Promise<any[]> => {
        return [{
          id: 'U12345',
          login: 'johnsmith',
          firstname: 'John',
          lastname: 'Smith',
          email: 'johnsmith@ssi.com',
          hotelId: 'hotel-1'
        }];
      },
      editUser: async (user: any): Promise<any> => {
        return;
      }
    };
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
    const activeRouteMock = {
      snapshot: {
        params: {
          id: 'user-89532'
        }
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
        EditUserComponent,
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
        },
        {
          provide: ActivatedRoute,
          useValue: activeRouteMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditUserComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be redirected to the user management page after discarding the form', () => {
    component.discard();

    expect(router.navigateByUrl).toHaveBeenCalledWith('admin/user-management');
  });

  describe('if submit succeeds', async () => {
    beforeEach(async () => {
      spyOnProperty(component['userFormComponent']!.userForm, 'valid', 'get').and.returnValue(true);

      await component.submitEditUser();
    });

    it('I should be redirected to the user management page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('admin/user-management');
    });

    it('I should not see error notification', () => {
      expect(component['notificationService'].showNotification).toHaveBeenCalledTimes(0);
    });
  });

  describe('if submit fails with an error', () => {
    beforeEach(async () => {
      spyOnProperty(component['userFormComponent']!.userForm, 'valid', 'get').and.returnValue(true);
      component['userService'].editUser = jasmine.createSpy().and.throwError('400');

      await component.submitEditUser();
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
