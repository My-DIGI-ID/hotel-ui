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
import {BookingDataComparisonComponent} from './booking-data-comparison.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {Router} from '@angular/router';
import {NotificationService} from 'carbon-components-angular';

class RouterMock {
  public getCurrentNavigation(): any {
    return {
      extras: {
        state: {
          success: true
        }
      }
    };
  }
}

describe('BookingDataComparisonComponent', () => {
  let component: BookingDataComparisonComponent;
  let fixture: ComponentFixture<BookingDataComparisonComponent>;

  beforeEach(async () => {
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      imports: [
        RouterTestingModule,
        HttpClientTestingModule
      ],
      declarations: [BookingDataComparisonComponent],
      providers: [
        {
          provide: Router,
          useClass: RouterMock
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDataComparisonComponent);
    component = fixture.componentInstance;

    component.checkInCredential = {
      id: '123',
      hotelId: 'hotel-1',
      deskId: 'desk-1',
      corporateId: {
        firstName: 'Peter',
        familyName: 'Park',
        companyName: 'Dial Bugle',
        companySubject: 'Science',
        companyAddressStreet: 'Manhattan 33',
        companyAddressZipCode: '0965MN',
        companyAddressCity: 'New York City'
      },
      masterId: {
        hardwareDid: '',
        firstName: 'Tony',
        familyName: 'Lark',
        addressStreet: 'Malibu point',
        addressCountry: 'United States',
        addressCity: 'Malibu',
        addressZipCode: '90265',
        dateOfBirth: '1990-01-12',
        dateOfExpiry: '2020-12-12'
      },
      valid: true
    };

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('should call the print method', () => {
    const printSpy = spyOn(window, 'print');

    component.showPrintDialog();
    fixture.detectChanges();

    expect(printSpy).toHaveBeenCalled();
  });
});
