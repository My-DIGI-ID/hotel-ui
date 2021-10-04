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

import {Component, OnInit} from '@angular/core';
import {BookingDataDTO, CheckInCredentialDTO, PMSDataDTO} from '../../../../api-client';
import {NavigationExtras, Router} from '@angular/router';
import {HotelIntegrationService} from '../../../services/hotel-integration/hotel-integration.service';
import {ApplicationURL} from '../../../utilities/application-url';
import {BookingDataValidation} from 'src/app/models/BookingDataValidation';
import {NotificationService} from 'carbon-components-angular';
import {WarningNotification} from 'src/app/models/notifications/WarningNotification';
import {SuccessNotification} from 'src/app/models/notifications/SuccessNotification';
import {Notification} from 'src/app/models/notifications/Notification';
import {ErrorNotification} from 'src/app/models/notifications/ErrorNotification';
import {StreetName} from 'src/app/utilities/street-name/street-name';

@Component({
  selector: 'app-booking-data-comparison',
  templateUrl: './booking-data-comparison.component.html',
  styleUrls: ['./booking-data-comparison.component.scss']
})
export class BookingDataComparisonComponent implements OnInit {
  public checkInCredential?: CheckInCredentialDTO;
  public bookingData?: BookingDataDTO;
  public bookingDataValidation?: BookingDataValidation;

  public constructor(private readonly router: Router,
                     private readonly hotelIntegrationControllerService: HotelIntegrationService,
                     private readonly notificationService: NotificationService,
                     private readonly streetName: StreetName) {
    this.checkInCredential = this.router.getCurrentNavigation()!.extras.state!.checkInCredential;
    this.bookingData = this.router.getCurrentNavigation()!.extras.state!.bookingData;
    this.bookingDataValidation = this.getBookingDataValidation();
  }

  public ngOnInit(): void {
    this.notificationService.showNotification(this.getDatasetsValidNotification());
  }

  public async sendDataToPMS(): Promise<void> {
    const navExtras: NavigationExtras = {
      state: {
        success: false
      }
    };

    try {
      await this.hotelIntegrationControllerService.sendDataToPMS(this.getPMSData());

      navExtras.state!.success = true;
    } catch (error: any) {
      this.notificationService.showNotification(new ErrorNotification());
    } finally {
      this.router.navigate([ApplicationURL.BookingDataComparisonNotification], navExtras);
    }
  }

  public getPMSData(): PMSDataDTO {
    return {
      bookingData: this.bookingData,
      checkInCredential: this.checkInCredential
    };
  }

  public isBookingFirstNameEqualToMasterIdFirstName(): boolean {
    return this.bookingData?.firstName?.toLowerCase() === this.checkInCredential?.masterId.firstName?.toLowerCase();
  }

  public isBookingLastNameEqualToMasterIdLastName(): boolean {
    return this.bookingData?.lastName?.toLowerCase() === this.checkInCredential?.masterId.familyName?.toLowerCase();
  }

  public isBookingStreetEqualToMasterIdStreet(): boolean {
    const bookingStreetSanitized = this.streetName.sanitizeForComparison(this.bookingData?.companyAddressStreet);
    const masterIdStreetSanitized = this.streetName.sanitizeForComparison(this.checkInCredential?.masterId.addressStreet);

    return bookingStreetSanitized === masterIdStreetSanitized;
  }

  public isBookingZipCodeEqualToMasterIdZipCode(): boolean {
    return this.bookingData?.companyAddressZipCode?.toLowerCase() === this.checkInCredential?.masterId.addressZipCode?.toLowerCase();
  }

  public isBookingCityEqualToMasterIdCity(): boolean {
    return this.bookingData?.companyAddressCity?.toLowerCase() === this.checkInCredential?.masterId.addressCity?.toLowerCase();
  }

  public showPrintDialog(): void {
    window.print();
  }

  private getDatasetsValidNotification(): Notification {
    if (!this.areDatasetsValid()) {
      return new WarningNotification('Datasets are different');
    }

    return new SuccessNotification('Datasets complete');
  }

  private areDatasetsValid(): boolean {
    return this.isBookingFirstNameEqualToMasterIdFirstName() &&
           this.isBookingLastNameEqualToMasterIdLastName() &&
           this.isBookingStreetEqualToMasterIdStreet() &&
           this.isBookingZipCodeEqualToMasterIdZipCode() &&
           this.isBookingCityEqualToMasterIdCity();
  }

  private getBookingDataValidation(): BookingDataValidation {
    return {
      isFirstNameValid: this.isBookingFirstNameEqualToMasterIdFirstName(),
      isLastNameValid: this.isBookingLastNameEqualToMasterIdLastName(),
      isStreetValid: this.isBookingStreetEqualToMasterIdStreet(),
      isZipCodeValid: this.isBookingZipCodeEqualToMasterIdZipCode(),
      isCityValid: this.isBookingCityEqualToMasterIdCity()
    };
  }
}
