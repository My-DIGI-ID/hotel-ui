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
import {BookingCorporateIdComponent} from './booking-corporate-id.component';
import {By} from '@angular/platform-browser';

describe('BookingCorporateIdComponent', () => {
  let bookingCorporateIdComponent: BookingCorporateIdComponent;
  let fixture: ComponentFixture<BookingCorporateIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BookingCorporateIdComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BookingCorporateIdComponent);
    bookingCorporateIdComponent = fixture.componentInstance;
    bookingCorporateIdComponent.corporateId = {
      firstName: 'Peter',
      familyName: 'Park',
      companyName: 'Dial Bugle',
      companySubject: 'Engineering',
      companyAddressStreet: 'Manhattan 33',
      companyAddressZipCode: '0965MN',
      companyAddressCity: 'New York City'
    };

    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    expect(bookingCorporateIdComponent).toBeTruthy();
  });

  it('I should be able to see first name', () => {
    const firstName = fixture.debugElement.query(By.css('#corporate-id-first-name'));

    expect(firstName.nativeElement.textContent).toBe('Peter');
  });

  it('I should be able to see last name', () => {
    const lastName = fixture.debugElement.query(By.css('#corporate-id-last-name'));

    expect(lastName.nativeElement.textContent).toBe('Park');
  });

  it('I should be able to see company name', () => {
    const companyName = fixture.debugElement.query(By.css('#corporate-id-company-name'));

    expect(companyName.nativeElement.textContent).toBe('Dial Bugle');
  });

  it('I should be able to see company subject', () => {
    const companySubject = fixture.debugElement.query(By.css('#corporate-id-company-subject'));

    expect(companySubject.nativeElement.textContent).toBe('Engineering');
  });

  it('I should be able to see company address street', () => {
    const companyAddressStreet = fixture.debugElement.query(By.css('#corporate-id-company-address-street'));

    expect(companyAddressStreet.nativeElement.textContent).toBe('Manhattan 33');
  });

  it('I should be able to see company address zip code', () => {
    const companyAddressZipCode = fixture.debugElement.query(By.css('#corporate-id-company-address-zip-code'));

    expect(companyAddressZipCode.nativeElement.textContent).toBe('0965MN');
  });

  it('I should be able to see company address city', () => {
    const companyAddressCity = fixture.debugElement.query(By.css('#corporate-id-company-address-city'));

    expect(companyAddressCity.nativeElement.textContent).toBe('New York City');
  });

  it('if I push the copy button, the copy to clipboard command should be run', () => {
    spyOn(document, 'execCommand');
    bookingCorporateIdComponent.copyToClipboard('123');

    expect(document.execCommand).toHaveBeenCalledWith('copy');
  });
});
