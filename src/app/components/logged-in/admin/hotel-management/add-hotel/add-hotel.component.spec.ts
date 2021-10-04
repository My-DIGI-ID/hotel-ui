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
import {AddHotelComponent} from './add-hotel.component';
import {By} from '@angular/platform-browser';
import {FormValidator} from '../../../../../utilities/form-validators/form-validator';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ModalService, NotificationService} from 'carbon-components-angular';
import {Router} from '@angular/router';
import {HotelService} from '../../../../../services/hotel/hotel.service';
import {HotelFormComponent} from '../hotel-form/hotel-form.component';
import {Component} from '@angular/core';

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
  public hotel: any;
}

describe('AddHotelComponent', () => {
  let component: AddHotelComponent;
  let fixture: ComponentFixture<AddHotelComponent>;
  let router: Router;

  beforeEach(async () => {
    const modalServiceMock = jasmine.createSpyObj('ModalService', ['create', 'destroy']);
    const hotelServiceMock = jasmine.createSpyObj('HotelService', ['createHotel']);
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [
        AddHotelComponent,
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
          provide: HotelService,
          useValue: hotelServiceMock
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
    fixture = TestBed.createComponent(AddHotelComponent);

    component = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be redirected to the hotel management page once the edit was successful', async () => {
    spyOnProperty(component['hotelFormComponent']!.hotelForm, 'valid', 'get').and.returnValue(true);

    await component.submitAddHotel();

    expect(router.navigateByUrl).toHaveBeenCalledWith('admin/hotel-management');
  });

  it('I should be redirected to the hotel management page after discarding the form', () => {
    component.discard();

    expect(router.navigateByUrl).toHaveBeenCalledWith('admin/hotel-management');
  });

  describe('if submit fails with an error', () => {
    beforeEach(async () => {
      spyOnProperty(component['hotelFormComponent']!.hotelForm, 'valid', 'get').and.returnValue(true);
      component['hotelService'].createHotel = jasmine.createSpy().and.throwError('400');

      await component.submitAddHotel();
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
