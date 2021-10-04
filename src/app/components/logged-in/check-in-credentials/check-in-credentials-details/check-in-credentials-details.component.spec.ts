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
import {CheckInCredentialsDetailsComponent} from './check-in-credentials-details.component';
import {RouterTestingModule} from '@angular/router/testing';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ActivatedRoute} from '@angular/router';
import Spy = jasmine.Spy;
import {By} from '@angular/platform-browser';
import {NotificationService} from 'carbon-components-angular';

describe('CheckInCredentialsDetailsComponent', () => {
  let checkInCredentialsDetailsComponent: CheckInCredentialsDetailsComponent;
  let fixture: ComponentFixture<CheckInCredentialsDetailsComponent>;
  let checkInCredentialsServiceSpy: Spy;
  let routerSpy: Spy;
  const routeId = '17801';
  const masterId = {
    hardwareDid: '',
    firstName: 'Tony',
    familyName: 'Lark',
    addressStreet: 'Malibu point',
    addressCountry: 'United States',
    addressCity: 'Malibu',
    addressZipCode: '90265',
    dateOfBirth: '1990-01-12',
    dateOfExpiry: '2020-01-20'
  };
  const corporateId = {
    firstName: 'Tony',
    familyName: 'Lark',
    companyName: 'Lark Industries',
    companySubject: 'Science',
    companyAddressStreet: 'Light street',
    companyAddressZipCode: '11100MP',
    companyAddressCity: 'New York'
  };
  const checkInCredential = {
    id: 'send-back-empty-array',
    hotelId: '2593487-g2j9405',
    deskId: '562784-P2X-f392478',
    scanDate: '2021-03-18T10:02:42.942Z',
    valid: true,
    masterId: masterId,
    corporateId: corporateId
  };
  const booking = {
    bookingId: '647835930',
    companyEmail: 'tony@larkindustries.com',
    firstName: 'Tony',
    lastName: 'Lark',
    companyAddressStreet: 'Light street',
    companyAddressZipCode: '11100MP',
    companyAddressCity: 'New York',
    arrivalDate: '2021-03-18',
    departureDate: '2021-03-19'
  };

  beforeEach(async () => {
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);
    const activeRouteMock = {
      snapshot: {
        params: {
          id: routeId
        }
      }
    };

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [CheckInCredentialsDetailsComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: activeRouteMock
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInCredentialsDetailsComponent);
    checkInCredentialsDetailsComponent = fixture.componentInstance;
    routerSpy = spyOn(checkInCredentialsDetailsComponent['router'], 'navigate');
    checkInCredentialsServiceSpy = spyOn(checkInCredentialsDetailsComponent['checkInCredentialsService'], 'getCheckInCredential');

    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    expect(checkInCredentialsDetailsComponent).toBeTruthy();
  });

  it('should load check in credentials details on page load', () => {
    expect(checkInCredentialsServiceSpy).toHaveBeenCalledTimes(1);
  });

  it('should load check in credentials for id taken from the url', () => {
    expect(checkInCredentialsServiceSpy).toHaveBeenCalledWith(routeId);
  });

  it('if bookings are shown I should not be able to see Search Component', () => {
    checkInCredentialsDetailsComponent.checkInCredential = checkInCredential;
    fixture.detectChanges();

    const bookings = fixture.debugElement.query(By.css('#app-bookings-component'));
    const bookingSearch = fixture.debugElement.query(By.css('#app-booking-search-component'));

    expect(bookings).toBeTruthy();
    expect(bookingSearch).toBeNull();
  });

  it('if Search Component is shown I should not be able to see bookings', () => {
    checkInCredentialsDetailsComponent.checkInCredential = checkInCredential;
    fixture.detectChanges();
    fixture.debugElement.query(By.css('#show-search-button')).nativeElement.click();
    fixture.detectChanges();

    const bookings = fixture.debugElement.query(By.css('#app-bookings-component'));
    const bookingSearch = fixture.debugElement.query(By.css('#app-booking-search-component'));

    expect(bookings).toBeNull();
    expect(bookingSearch).toBeTruthy();
  });

  it('if I click on Check Data button while bookings are shown I should be taken to booking data comparison page', () => {
    checkInCredentialsDetailsComponent.checkInCredential = checkInCredential;
    checkInCredentialsDetailsComponent.updateSelectedBooking(booking);
    checkInCredentialsDetailsComponent.anyRowSelected = true;

    fixture.detectChanges();

    fixture.debugElement.query(By.css('#compare-booking-data-button')).nativeElement.click();

    expect(routerSpy).toHaveBeenCalledOnceWith(
      ['booking-data-comparison'],
      {
        state: {
          checkInCredential: checkInCredential,
          bookingData: booking
        }
      }
    );
  });
});
