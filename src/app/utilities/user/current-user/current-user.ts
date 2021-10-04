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
import {UserRoles} from '../user-roles';
import {Token} from '../../token/token';
import {ReplaySubject} from 'rxjs';
import {HotelService} from '../../../services/hotel/hotel.service';

@Injectable({
  providedIn: 'root'
})
export class CurrentUser {
  public role?: UserRoles;
  public loggedIn$: ReplaySubject<boolean> = new ReplaySubject<boolean>(1);

  public constructor(private readonly token: Token,
                     private readonly hotelService: HotelService) {
    this.setUpUser();
  }

  public isAdmin(): boolean {
    return this.role === UserRoles.Admin;
  }

  public isUser(): boolean {
    return this.role === UserRoles.User;
  }

  public setUserRoleFromDecodedTokenAuthField(auth: string): void {
    if (auth === UserRoles.Admin) {
      this.role = UserRoles.Admin;
    }
    if (auth === UserRoles.User) {
      this.role = UserRoles.User;
    }
  }

  public setUpUser(): void {
    const decodedToken = this.token.getDecoded();

    if (decodedToken) {
      this.setUserRoleFromDecodedTokenAuthField(decodedToken.auth);
      this.loggedIn$.next(true);
    }
  }

  public logOut(): void {
    this.hotelService.clearHotel();
    this.role = undefined;
    this.token.remove();
    this.loggedIn$.next(false);
  }
}
