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
import {BookingDataComponent} from './booking-data.component';
import {By} from '@angular/platform-browser';

describe('BookingDataComponent', () => {
  let bookingDataComponent: BookingDataComponent;
  let fixture: ComponentFixture<BookingDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingDataComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingDataComponent);
    bookingDataComponent = fixture.componentInstance;
    bookingDataComponent.bookingData = {
      bookingId: '34567',
      companyEmail: 'peter.park@dial.com',
      firstName: 'Peter',
      lastName: 'Park',
      companyAddressStreet: 'Houdson',
      companyAddressZipCode: 'AS529',
      companyAddressCity: 'New York',
      arrivalDate: '2021-03-08T15:30:47.517Z',
      departureDate: '2021-03-08T15:30:47.517Z',
      guestId: '12-PAME-X14'
    };

    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    expect(bookingDataComponent).toBeTruthy();
  });

  it('I should be able to see booking id', () => {
    const bookingNumber = fixture.debugElement.query(By.css('#booking-data-booking-number'));

    expect(bookingNumber.nativeElement.textContent).toBe('34567');
  });

  it('I should be able to see company email', () => {
    const companyEmail = fixture.debugElement.query(By.css('#booking-data-email'));

    expect(companyEmail.nativeElement.textContent).toBe('peter.park@dial.com');
  });

  it('I should be able to see first name', () => {
    const firstName = fixture.debugElement.query(By.css('#booking-data-first-name'));

    expect(firstName.nativeElement.textContent).toBe('Peter');
  });

  it('I should be able to see last name', () => {
    const lastName = fixture.debugElement.query(By.css('#booking-data-last-name'));

    expect(lastName.nativeElement.textContent).toBe('Park');
  });

  it('I should be able to see company address street', () => {
    const companyAddressStreet = fixture.debugElement.query(By.css('#booking-data-company-address-street'));

    expect(companyAddressStreet.nativeElement.textContent).toBe('Houdson');
  });

  it('I should be able to see company address zip code', () => {
    const companyAddressZipCode = fixture.debugElement.query(By.css('#booking-data-company-address-zip-code'));

    expect(companyAddressZipCode.nativeElement.textContent).toBe('AS529');
  });

  it('I should be able to see company address city', () => {
    const companyAddressCity = fixture.debugElement.query(By.css('#booking-data-company-address-city'));

    expect(companyAddressCity.nativeElement.textContent).toBe('New York');
  });
});
