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

import {Component, ViewChild, AfterViewInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {HotelService} from 'src/app/services/hotel/hotel.service';
import {HotelDTO} from 'src/api-client';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';
import {ApplicationURL} from 'src/app/utilities/application-url';
import {HotelFormComponent} from '../hotel-form/hotel-form.component';
import {ErrorNotification} from 'src/app/models/notifications/ErrorNotification';
import {NotificationService} from 'carbon-components-angular';

@Component({
  selector: 'app-edit-hotel',
  templateUrl: './edit-hotel.component.html',
  styleUrls: ['./edit-hotel.component.scss']
})
export class EditHotelComponent implements AfterViewInit {
  @ViewChild(HotelFormComponent)
  private readonly hotelFormComponent?: HotelFormComponent;

  public constructor(public readonly formValidator: FormValidator,
                     private readonly router: Router,
                     private readonly activatedRoute: ActivatedRoute,
                     private readonly hotelService: HotelService,
                     private readonly notificationService: NotificationService) {
  }

  public async ngAfterViewInit(): Promise<void> {
    try {
      const hotelId = this.activatedRoute.snapshot.params.id;
      const hotel = await this.hotelService.getHotelById(hotelId);

      this.hotelFormComponent!.disableHotelIdField();
      this.hotelFormComponent!.populateHotelForm(hotel);
    } catch (error: any) {
      this.notificationService.showNotification(new ErrorNotification());
    }
  }

  public async submitEditHotel(): Promise<void> {
    if (this.hotelFormComponent?.hotelForm.valid) {
      const hotel = this.createHotelDTO();

      try {
        await this.hotelService.updateHotel(hotel);

        this.router.navigateByUrl(ApplicationURL.AdminHotelManagement);
      } catch (httpErrorResponse: any) {
        this.notificationService.showNotification(new ErrorNotification());
      }
    }
  }

  public discard(): void {
    this.router.navigateByUrl(ApplicationURL.AdminHotelManagement);
  }

  private createHotelDTO(): HotelDTO {
    return this.formValidator.getSanitizedRawFormValues(this.hotelFormComponent!.hotelForm);
  }
}
