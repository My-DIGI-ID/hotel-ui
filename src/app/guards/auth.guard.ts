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

import {Injectable} from '@angular/core';
import {Router, CanActivate} from '@angular/router';
import {Token} from '../utilities/token/token';
import {ApplicationURL} from '../utilities/application-url';
import {CurrentUser} from '../utilities/user/current-user/current-user';

@Injectable()
export class AuthGuard implements CanActivate {
  public constructor(private readonly currentUser: CurrentUser,
                     private readonly router: Router,
                     private readonly token: Token) {
  }

  public canActivate(): boolean {
    if (this.token.isValid()) {
      return true;
    }
    this.currentUser.logOut();
    this.router.navigateByUrl(ApplicationURL.Login);

    return false;
  }
}
