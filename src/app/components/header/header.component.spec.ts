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
import {HeaderComponent} from './header.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {RouterTestingModule} from '@angular/router/testing';
import {ReplaySubject} from 'rxjs';
import {By} from '@angular/platform-browser';
import {CurrentUser} from '../../utilities/user/current-user/current-user';

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  const userAvailableButtonsIds = {
    dashboard: '#dashboard-icon'
  };
  const otherAvailableButtonIds = {
    hotelName: '#header-hotel-name',
    hotelLogo: '#header-hotel-logo',
    loggedIn: '#unlocked-icon',
    loggedOut: '#locked-icon'
  };

  beforeEach(async () => {
    const currentUser = {
      loggedIn$: new ReplaySubject<boolean>(1),
      isUser: () => undefined,
      isAdmin: () => undefined
    };
    currentUser.loggedIn$.next(true);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule
      ],
      declarations: [HeaderComponent],
      providers: [
        {
          provide: CurrentUser,
          useValue: currentUser
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('I should be able to see the hotel logo', () => {
    const hotelLogo = fixture.debugElement.query(By.css(otherAvailableButtonIds.hotelLogo));

    expect(hotelLogo).toBeTruthy();
  });

  describe('If I am logged in', () => {
    beforeEach(() => {
      component.currentUser.loggedIn$.next(true);

      fixture.detectChanges();
    });

    describe('as an User,', () => {
      beforeEach(() => {
        spyOn(component.currentUser, 'isUser').and.returnValue(true);
        spyOn(component.currentUser, 'isAdmin').and.returnValue(false);
        fixture.detectChanges();
      });

      it('I should be able to see the hotel name', () => {
        const hotelName = fixture.debugElement.query(By.css(otherAvailableButtonIds.hotelName));

        expect(hotelName).toBeTruthy();
      });

      it('I should be able to see the dashboard button', () => {
        const dashboardIcon = fixture.debugElement.query(By.css(userAvailableButtonsIds.dashboard));

        expect(dashboardIcon).toBeTruthy();
      });
    });

    describe('as an Admin,', () => {
      beforeEach(() => {
        spyOn(component.currentUser, 'isUser').and.returnValue(false);
        spyOn(component.currentUser, 'isAdmin').and.returnValue(true);
        fixture.detectChanges();
      });

      it('I should not be able to see the dashboard button', () => {
        const dashboardIcon = fixture.debugElement.query(By.css(userAvailableButtonsIds.dashboard));

        expect(dashboardIcon).toBeFalsy();
      });
    });

    it('I should be able to see the unlocked button', () => {
      const unlockedIcon = fixture.debugElement.query(By.css(otherAvailableButtonIds.loggedIn));

      expect(unlockedIcon).toBeTruthy();
    });

    it('I should not be able to see display the locked button', () => {
      const lockedIcon = fixture.debugElement.query(By.css(otherAvailableButtonIds.loggedOut));

      expect(lockedIcon).toBeFalsy();
    });
  });

  describe('If I am not logged in', () => {
    beforeEach(() => {
      component.currentUser.loggedIn$.next(false);

      fixture.detectChanges();
    });

    // tslint:disable-next-line:no-identical-functions
    it('I should not be able to see the dashboard button', () => {
      const dashboardIcon = fixture.debugElement.query(By.css(userAvailableButtonsIds.dashboard));

      expect(dashboardIcon).toBeFalsy();
    });

    it('I should not be able to see the unlocked button', () => {
      const unlockedIcon = fixture.debugElement.query(By.css(otherAvailableButtonIds.loggedIn));

      expect(unlockedIcon).toBeFalsy();
    });

    it('I should be able to see the locked button', () => {
      const lockedIcon = fixture.debugElement.query(By.css(otherAvailableButtonIds.loggedOut));

      expect(lockedIcon).toBeTruthy();
    });
  });
});
