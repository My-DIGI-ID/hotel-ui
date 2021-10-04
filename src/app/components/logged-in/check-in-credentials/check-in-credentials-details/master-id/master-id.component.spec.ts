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
import {MasterIdComponent} from './master-id.component';
import {By} from '@angular/platform-browser';

describe('MasterIdComponent', () => {
  let masterIdComponent: MasterIdComponent;
  let fixture: ComponentFixture<MasterIdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [MasterIdComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MasterIdComponent);
    masterIdComponent = fixture.componentInstance;

    masterIdComponent.userDetails = {
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

    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    expect(masterIdComponent).toBeTruthy();
  });

  it('I should be able to see selected master-id First name', () => {
    const firstName = fixture.debugElement.query(By.css('#master-id-first-name'));

    expect(firstName.nativeElement.textContent).toBe('Tony');
  });

  it('I should be able to see selected master-id Last name', () => {
    const lastName = fixture.debugElement.query(By.css('#master-id-last-name'));

    expect(lastName.nativeElement.textContent).toBe('Lark');
  });

  it('I should be able to see selected master-id Date of birth', () => {
    const dateOfBirth = fixture.debugElement.query(By.css('#master-id-date-of-birth'));

    expect(dateOfBirth.nativeElement.textContent).toBe('1990-01-12');
  });

  it('I should be able to see selected master-id Street', () => {
    const addressStreet = fixture.debugElement.query(By.css('#master-id-address-street'));

    expect(addressStreet.nativeElement.textContent).toBe('Malibu point');
  });

  it('I should be able to see selected master-id Zip code', () => {
    const addressZipCode = fixture.debugElement.query(By.css('#master-id-address-zip-code'));

    expect(addressZipCode.nativeElement.textContent).toBe('90265');
  });

  it('I should be able to see selected master-id City', () => {
    const addressCity = fixture.debugElement.query(By.css('#master-id-address-city'));

    expect(addressCity.nativeElement.textContent).toBe('Malibu');
  });

  it('I should be able to see selected master-id Country', () => {
    const addressCountry = fixture.debugElement.query(By.css('#master-id-address-country'));

    expect(addressCountry.nativeElement.textContent).toBe('United States');
  });
});
