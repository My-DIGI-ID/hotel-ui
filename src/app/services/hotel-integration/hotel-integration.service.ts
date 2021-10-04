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
import {BookingDataDTO, CheckInCredentialDTO, HotelIntegrationControllerService, PMSDataDTO} from '../../../api-client';

@Injectable({
  providedIn: 'root'
})
export class HotelIntegrationService {
  public constructor(private readonly hotelAPI: HotelIntegrationControllerService) {
  }

  public async sendDataToPMS(pmsData: PMSDataDTO): Promise<PMSDataDTO> {
    return await this.hotelAPI.sendPMSData(pmsData).toPromise();
  }

  public async lookup(checkinCredential: CheckInCredentialDTO, bookingNumber?: string): Promise<BookingDataDTO[]> {
    return await this.hotelAPI.lookup(checkinCredential, bookingNumber).toPromise();
  }
}
