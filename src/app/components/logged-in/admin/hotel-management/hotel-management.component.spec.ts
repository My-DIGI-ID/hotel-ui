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
import {HotelManagementComponent} from './hotel-management.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ModalService, PlaceholderService} from 'carbon-components-angular';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {HotelDTO} from 'src/api-client';
import {HotelService} from 'src/app/services/hotel/hotel.service';

describe('HotelManagementComponent', () => {
  let component: HotelManagementComponent;
  let fixture: ComponentFixture<HotelManagementComponent>;

  beforeEach(async () => {
    const hotelServiceMock = {
      getAllHotels: async (): Promise<HotelDTO[]> => {
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
            ],
            address: {
              street: 'Summer Street',
              houseNumber: '12',
              postalCode: '8090',
              city: 'Szentendre'
            }
          }
        ];
      }
    };

    await TestBed.configureTestingModule({
      declarations: [HotelManagementComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      providers: [
        ModalService,
        PlaceholderService,
        {
          provide: HotelService,
          useValue: hotelServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HotelManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('I should see the page title', () => {
    const hotelManagementPageTitle = fixture.debugElement.query(By.css('#hotel-management-page-title'));

    expect(hotelManagementPageTitle).toBeTruthy();
  });
});
