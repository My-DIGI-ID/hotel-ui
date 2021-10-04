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
import {UserManagementComponent} from './user-management.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {ModalService, PlaceholderModule} from 'carbon-components-angular';
import {By} from '@angular/platform-browser';
import {RouterTestingModule} from '@angular/router/testing';
import {UserService} from 'src/app/services/user/user.service';
import {HotelService} from 'src/app/services/hotel/hotel.service';

describe('UserManagementComponent', () => {
  let component: UserManagementComponent;
  let fixture: ComponentFixture<UserManagementComponent>;

  beforeEach(async () => {
    const hotelServiceMock = {
      getAllHotels: async (): Promise<any[]> => {
        return [
          {
            id: 'hotel-1',
            name: 'Bee Hotel',
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

    const userServiceMock = {
      getAllUsers: async (): Promise<any[]> => {
        return [{
          id: '123',
          login: 'nicolas.cage22',
          firstname: 'Jurgen',
          lastname: 'Jager',
          email: 'jurgen.jager@ghotel.de',
          hotelId: 'hotel-1'
        }];
      }
    };

    await TestBed.configureTestingModule({
      declarations: [UserManagementComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        PlaceholderModule
      ],
      providers: [
        ModalService,
        {
          provide: HotelService,
          useValue: hotelServiceMock
        },
        {
          provide: UserService,
          useValue: userServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('I should see the page title', () => {
    const userManagementPageTitle = fixture.debugElement.query(By.css('#user-management-page-title'));

    expect(userManagementPageTitle).toBeTruthy();
  });
});
