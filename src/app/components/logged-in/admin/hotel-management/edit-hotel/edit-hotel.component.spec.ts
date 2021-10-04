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
import {EditHotelComponent} from './edit-hotel.component';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';
import {ModalService, NotificationService} from 'carbon-components-angular';
import {Router, ActivatedRoute} from '@angular/router';
import Spy = jasmine.Spy;
import {By} from '@angular/platform-browser';
import {HotelFormComponent} from '../hotel-form/hotel-form.component';
import {Component} from '@angular/core';
import {AddressDTO, DeskDTO} from '../../../../../../api-client';

@Component({
  selector: 'app-hotel-form-mock-component',
  template: '',
  providers: [
    {
      provide: HotelFormComponent,
      useClass: HotelFormMockComponent
    }
  ]
})
class HotelFormMockComponent {
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

  public getSanitizedFormStringValue(control: any): any {
    return control.value;
  }

  public getSanitizedRawFormValues(form: any): any {
    return form.getRawValue();
  }
}

describe('EditHotelComponent', () => {
  let component: EditHotelComponent;
  let fixture: ComponentFixture<EditHotelComponent>;
  let router: Router;
  let hotelServiceSpy: Spy;
  const hotelId = 'hotelId-1';

  afterEach(() => {
    fixture.destroy();
  });

  beforeEach(async () => {
    const modalServiceMock = jasmine.createSpyObj('ModalService', ['create', 'destroy']);
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const activeRouteMock = {
      snapshot: {
        params: {
          id: hotelId
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        EditHotelComponent,
        HotelFormComponent
      ],
      providers: [
        {
          provide: FormValidator,
          useClass: FormValidatorMock
        },
        {
          provide: ModalService,
          useValue: modalServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        },
        {
          provide: ActivatedRoute,
          useValue: activeRouteMock
        },
        {
          provide: HotelFormComponent,
          useClass: HotelFormMockComponent
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(EditHotelComponent);
    component = fixture.componentInstance;
    hotelServiceSpy = spyOn(component['hotelService'], 'getHotelById').and.returnValue(Promise.resolve({
      id: 'hotel-1',
      name: 'Test Hotel',
      address: {
        street: 'Test st.',
        houseNumber: '0123',
        postalCode: '093402',
        city: 'Test City'
      },
      desks: []
    }));
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be redirected to the hotel management page after discarding the form', () => {
    component.discard();

    expect(router.navigateByUrl).toHaveBeenCalledWith('admin/hotel-management');
  });

  it('should load hotel name on page load', () => {
    expect(hotelServiceSpy).toHaveBeenCalledTimes(1);
  });

  describe('after saving the form', () => {
    beforeEach(async () => {
      component['hotelService'].updateHotel = jasmine.createSpy().and.returnValue(Promise.resolve());

      spyOnProperty(component['hotelFormComponent']!.hotelForm, 'valid', 'get').and.returnValue(true);
      await component.submitEditHotel();
    });

    it('I should be redirected to the hotel management page', () => {
      expect(router.navigateByUrl).toHaveBeenCalledWith('admin/hotel-management');
    });

    it('I should not see error notification', () => {
      expect(component['notificationService'].showNotification).toHaveBeenCalledTimes(0);
    });
  });

  describe('if submit fails with an error', () => {
    beforeEach(async () => {
      spyOnProperty(component['hotelFormComponent']!.hotelForm, 'valid', 'get').and.returnValue(true);
      component['hotelService'].updateHotel = jasmine.createSpy().and.throwError('400');

      await component.submitEditHotel();
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
