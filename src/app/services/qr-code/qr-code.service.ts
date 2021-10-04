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
import {combineLatest, Observable} from 'rxjs';
import {map} from 'rxjs/operators';
import {AppConfigurationsService} from '../app-configurations/app-configurations.service';
import {HotelService} from '../hotel/hotel.service';

@Injectable({
  providedIn: 'root'
})
export class QrCodeService {
  public constructor(
    private readonly hotelService: HotelService,
    private readonly config: AppConfigurationsService) {
  }

  public getURL(): Observable<string> {
    return combineLatest([this.hotelService.getHotel(), this.hotelService.getSelectedDesk()]).pipe(map(([hotel, selectedDesk]) => {
      const apiURL: string = this.config.controllerExternalAPIUrl ? this.config.controllerExternalAPIUrl : this.config.controllerAPIUrl!;

      return `${apiURL}/api/request-proof?hotelId=${hotel?.id}&deskId=${selectedDesk?.id}`;
    }));
  }
}
