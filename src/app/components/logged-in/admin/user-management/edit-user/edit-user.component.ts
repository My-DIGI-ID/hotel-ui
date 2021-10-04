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

import {AfterViewInit, Component, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {UserService} from '../../../../../services/user/user.service';
import {UserDTO} from '../../../../../../api-client';
import {UserFormComponent} from '../user-form/user-form.component';
import {ListItem, NotificationService} from 'carbon-components-angular';
import {HotelService} from '../../../../../services/hotel/hotel.service';
import {ApplicationURL} from '../../../../../utilities/application-url';
import {FormValidator} from '../../../../../utilities/form-validators/form-validator';
import {ErrorNotification} from 'src/app/models/notifications/ErrorNotification';

@Component({
  selector: 'app-edit-user',
  templateUrl: './edit-user.component.html',
  styleUrls: ['./edit-user.component.scss']
})
export class EditUserComponent implements AfterViewInit {
  private readonly userId: string;

  @ViewChild(UserFormComponent)
  private readonly userFormComponent?: UserFormComponent;

  public constructor(private readonly router: Router,
                     private readonly formValidator: FormValidator,
                     private readonly activatedRoute: ActivatedRoute,
                     private readonly hotelService: HotelService,
                     private readonly userService: UserService,
                     private readonly notificationService: NotificationService) {
    this.userId = this.activatedRoute.snapshot.params.id;
  }

  public async ngAfterViewInit(): Promise<void> {
    try {
      const user = await this.getUser(this.userId);
      let hotels = await this.getHotels();

      hotels = this.sortHotelsAlphabetically(hotels);
      hotels = this.markUserHotelAsSelected(user.hotelId, hotels);

      this.userFormComponent!.hotels = hotels;
      this.userFormComponent!.filteredHotels = hotels;

      this.userFormComponent!.disablePasswordField();
      this.userFormComponent!.populateForm(user);
    } catch (error: any) {
      this.notificationService.showNotification(new ErrorNotification());
    }
  }

  public async submitEditUser(): Promise<void> {
    if (this.userFormComponent?.userForm.valid) {
      const userDTO = this.createUserDTO();

      try {
        await this.userService.editUser(userDTO);

        this.router.navigateByUrl(ApplicationURL.AdminUserManagement);
      } catch (error: any) {
        this.notificationService.showNotification(new ErrorNotification());
      }
    }
  }

  public discard(): void {
    this.router.navigateByUrl(ApplicationURL.AdminUserManagement);
  }

  private async getUser(userId: string): Promise<UserDTO> {
    return await this.userService.getUser(userId);
  }

  private createUserDTO(): UserDTO {
    const userFormValues = this.formValidator.getSanitizedRawFormValues(this.userFormComponent!.userForm);

    return {
      id: this.userId,
      login: userFormValues.login,
      firstname: userFormValues.firstName,
      lastname: userFormValues.lastName,
      email: userFormValues.email,
      hotelId: userFormValues.hotel.id
    };
  }

  private async getHotels(): Promise<ListItem[]> {
    return (await this.hotelService.getAllHotels()).map((hotel) => {
      return {
        content: hotel.name,
        id: hotel.id,
        selected: false
      };
    });
  }

  private markUserHotelAsSelected(userHotelId: string, hotels: ListItem[]): ListItem[] {
    return hotels.map((hotel) => {
      if (hotel.id === userHotelId) {
        hotel.selected = true;
      }

      return hotel;
    });
  }

  private sortHotelsAlphabetically(hotels: ListItem[]): ListItem[] {
    return hotels.sort((hotel1, hotel2) => {
      return hotel1.content.localeCompare(hotel2.content);
    });
  }
}
