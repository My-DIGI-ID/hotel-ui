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

import {TestBed} from '@angular/core/testing';
import {CurrentUser} from './current-user';
import {Token} from '../../token/token';
import {HttpClientTestingModule} from '@angular/common/http/testing';

enum UserRoles {
  User = 'ROLE_USER',
  Admin = 'ROLE_ADMIN'
}

describe('CurrentUser', () => {
  let currentUser: CurrentUser;

  beforeEach(async () => {
    const tokenService = {
      getDecoded: () => {
        return {auth: UserRoles.User};
      }
    };

    TestBed.configureTestingModule({
      providers: [
        {
          provide: Token,
          useValue: tokenService
        }
      ],
      imports: [HttpClientTestingModule]
    });
    currentUser = TestBed.inject(CurrentUser);
  });

  it('instance should be successfully created', () => {
    expect(currentUser).toBeTruthy();
  });

  it('after page refresh user role should be set', () => {
    expect(currentUser.isUser()).toBeTrue();
  });

  describe('an ADMIN', () => {
    beforeEach(async () => {
      currentUser.role = undefined;
      currentUser.setUserRoleFromDecodedTokenAuthField(UserRoles.Admin);
    });

    it('should be identified as an Admin', () => {
      expect(currentUser.isAdmin()).toBeTrue();
    });

    it('should not be identified as an User', () => {
      expect(currentUser.isUser()).toBeFalse();
    });
  });

  describe('an USER', () => {
    beforeEach(async () => {
      currentUser.role = undefined;
      currentUser.setUserRoleFromDecodedTokenAuthField(UserRoles.User);
    });

    it('should be identified as an User', () => {
      expect(currentUser.isUser()).toBeTrue();
    });

    it('should not be identified as an Admin', () => {
      expect(currentUser.isAdmin()).toBeFalse();
    });
  });
});
