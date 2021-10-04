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
import {AuthenticationService, JWTTokenDTO, LoginVM} from '../../../api-client';
import {CurrentUser} from '../../utilities/user/current-user/current-user';
import {Token} from '../../utilities/token/token';
import {HotelService} from '../hotel/hotel.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  public constructor(private readonly token: Token,
                     private readonly currentUser: CurrentUser,
                     private readonly hotelService: HotelService,
                     private readonly authenticationService: AuthenticationService) {
  }

  public async login(credentials: LoginVM): Promise<void> {
    const token = await this.authenticationService.authorize(credentials).toPromise();

    this.token.set(token.id_token);
    this.currentUser.setUpUser();
  }

  public async logOut(): Promise<void> {
    const jwtTokenDTO: JWTTokenDTO = {
      token: this.token.get()
    };

    if (jwtTokenDTO.token) {
      this.authenticationService.logout(jwtTokenDTO).toPromise();
    }

    this.currentUser.logOut();
  }
}
