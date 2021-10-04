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

import {Component, ViewChild} from '@angular/core';
import {HotelService} from '../../../../../services/hotel/hotel.service';
import {HotelDTO} from '../../../../../../api-client';
import {FormValidator} from '../../../../../utilities/form-validators/form-validator';
import {ApplicationURL} from '../../../../../utilities/application-url';
import {Router} from '@angular/router';
import {BadRequestError} from '../../../../../models/BadRequestError';
import {ErrorTypeDeterminer} from '../../../../../utilities/error-type-determiner/error-type-determiner';
import {HotelFormComponent} from '../hotel-form/hotel-form.component';
import {ErrorNotification} from 'src/app/models/notifications/ErrorNotification';
import {NotificationService} from 'carbon-components-angular';

enum AddHotelBadRequestError {
  NotUnique = 'A hotel with the given id already exists.'
}

@Component({
  selector: 'app-add-hotel',
  templateUrl: './add-hotel.component.html',
  styleUrls: ['./add-hotel.component.scss']
})
export class AddHotelComponent {
  @ViewChild(HotelFormComponent)
  private readonly hotelFormComponent?: HotelFormComponent;

  public constructor(public readonly formValidator: FormValidator,
                     private readonly router: Router,
                     private readonly hotelService: HotelService,
                     private readonly notificationService: NotificationService) {
  }

  public async submitAddHotel(): Promise<void> {
    if (this.hotelFormComponent?.hotelForm.valid) {
      const hotel = this.createHotelDTO();

      try {
        await this.hotelService.createHotel(hotel);

        this.router.navigateByUrl(ApplicationURL.AdminHotelManagement);
      } catch (httpErrorResponse: any) {
        this.checkErrorResponseType(httpErrorResponse);
      }
    }
  }

  public discard(): void {
    this.router.navigateByUrl(ApplicationURL.AdminHotelManagement);
  }

  private createHotelDTO(): HotelDTO {
    return this.formValidator.getSanitizedRawFormValues(this.hotelFormComponent!.hotelForm);
  }

  private checkErrorResponseType(httpErrorResponse: any): void {
    if (ErrorTypeDeterminer.IS_HTTP_ERROR_RESPONSE(httpErrorResponse) &&
        ErrorTypeDeterminer.IS_ERROR_TYPE_BAD_REQUEST(httpErrorResponse.error)) {
      this.handleBadRequestError(httpErrorResponse.error);
    } else {
      this.notificationService.showNotification(new ErrorNotification());
    }
  }

  private handleBadRequestError(badRequestError: BadRequestError): void {
    if (badRequestError.detail.includes(AddHotelBadRequestError.NotUnique)) {
      this.hotelFormComponent!.hotelForm.get('id')!.setErrors({'notUnique': true});
    } else {
      this.notificationService.showNotification(new ErrorNotification());
    }
  }
}
