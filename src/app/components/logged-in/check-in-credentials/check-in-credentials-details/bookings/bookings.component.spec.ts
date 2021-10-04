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
import {BookingsComponent} from './bookings.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DatePipe} from '@angular/common';
import {HotelIntegrationService} from '../../../../../services/hotel-integration/hotel-integration.service';
import {TableComponent} from '../../../table/table.component';
import {By} from '@angular/platform-browser';

describe('BookingsComponent', () => {
  let component: BookingsComponent;
  let fixture: ComponentFixture<BookingsComponent>;
  let hotelIntegrationService: HotelIntegrationService;
  const bookingNumber = '2f08j95-g0259';
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
  const checkInCredentialWithoutBookings = {
    id: 'send-back-empty-array',
    hotelId: '2593487-g2j9405',
    deskId: '562784-P2X-f392478',
    scanDate: '2021-03-18T10:02:42.942Z',
    valid: true,
    masterId: masterId,
    corporateId: corporateId
  };
  const checkInCredentialWithBookings = {
    id: '9678453-fhp29850-d41678',
    hotelId: '2593487-g2j9405',
    deskId: '562784-P2X-f392478',
    scanDate: '2021-03-18T10:02:42.942Z',
    valid: true,
    masterId: masterId,
    corporateId: corporateId
  };
  const bookingData = {
    bookingId: bookingNumber,
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
    const datePipeSpy = jasmine.createSpyObj('DatePipe', ['transform']);
    const hotelIntegrationServiceMock = {
      lookup: async (credential: any, booking: string) => {
        if (credential?.id === 'send-back-empty-array') {
          return Promise.resolve([]);
        }

        return Promise.resolve([bookingData]);
      }
    };

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [
        BookingsComponent,
        TableComponent
      ],
      providers: [
        {
          provide: DatePipe,
          useValue: datePipeSpy
        },
        {
          provide: HotelIntegrationService,
          useValue: hotelIntegrationServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingsComponent);
    hotelIntegrationService = TestBed.inject(HotelIntegrationService);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  it('should set loading to false after view init', async () => {
    await component.ngAfterViewInit();

    expect(component.loading).toBe(false);
  });

  it('if I do not search for specific booking number all related bookings should be requested', async () => {
    component.searchString = '';
    component.checkInCredential = checkInCredentialWithBookings;

    spyOn(hotelIntegrationService, 'lookup').and.callThrough();

    await component.ngAfterViewInit();

    expect(hotelIntegrationService.lookup).toHaveBeenCalledOnceWith(checkInCredentialWithBookings);
  });

  it('if I search for specific booking number only bookings with that number should be requested', async () => {
    component.searchString = bookingNumber;
    component.checkInCredential = checkInCredentialWithBookings;

    spyOn(hotelIntegrationService, 'lookup').and.callThrough();

    await component.ngAfterViewInit();

    expect(hotelIntegrationService.lookup).toHaveBeenCalledOnceWith(checkInCredentialWithBookings, bookingNumber);
  });

  it('if bookings are empty I should be able to see warning message', async () => {
    component.searchString = '';
    component.checkInCredential = checkInCredentialWithoutBookings;
    component['showWarningNotification']('Alert!');

    fixture.detectChanges();

    const warningNotification = fixture.debugElement.query(By.css('#warning-notification'));

    expect(warningNotification).toBeTruthy();
  });

  it('if bookings are not empty I should not be able to see warning message', async () => {
    component.searchString = '';
    component.checkInCredential = checkInCredentialWithBookings;

    await component.ngAfterViewInit();

    fixture.detectChanges();

    const warningNotification = fixture.debugElement.query(By.css('#warning-notification'));

    expect(warningNotification).toBeNull();
  });
});
