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

import {Component, OnInit, OnDestroy} from '@angular/core';
import {Router} from '@angular/router';
import {Observable, Subject} from 'rxjs';
import {DeskDTO, HotelDTO} from '../../../api-client';
import {HotelService} from '../../services/hotel/hotel.service';
import {map} from 'rxjs/operators';
import {ApplicationURL} from '../../utilities/application-url';
import {AppConfigurationsService} from '../../services/app-configurations/app-configurations.service';
import {CurrentUser} from '../../utilities/user/current-user/current-user';
import {AuthService} from '../../services/auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit, OnDestroy {
  public hotel$?: Subject<HotelDTO>;
  public selectedDesk$?: Subject<DeskDTO>;
  public deskItems$?: Observable<DeskDTO[]>;
  public isDeskDropdownCollapsed: boolean = true;

  public constructor(public readonly currentUser: CurrentUser,
                     private readonly router: Router,
                     private readonly hotelService: HotelService,
                     private readonly config: AppConfigurationsService,
                     private readonly authService: AuthService) {
  }

  public ngOnInit(): void {
    this.currentUser.loggedIn$.subscribe((loggedIn) => {
      if (loggedIn && this.currentUser.isUser()) {
        this.loadDataForUserHeader();
      }
    });
  }

  public logout(): void {
    this.authService.logOut();

    this.router.navigateByUrl(ApplicationURL.Login);
  }

  public onDeskChange(desk: DeskDTO): void {
    this.hotelService.selectDesk(desk);
    this.isDeskDropdownCollapsed = true;
  }

  public getLogoUrl(): string | undefined {
    return this.config.logoUrl;
  }

  public showUserManagement(): void {
    this.router.navigateByUrl(ApplicationURL.AdminUserManagement);
  }

  public showHotelManagement(): void {
    this.router.navigateByUrl(ApplicationURL.AdminHotelManagement);
  }

  public ngOnDestroy(): void {
    this.hotel$!.unsubscribe();
    this.selectedDesk$!.unsubscribe();
  }

  private async loadDataForUserHeader(): Promise<void> {
    await this.hotelService.refreshHotel();

    this.hotel$ = this.hotelService.getHotel();
    this.selectedDesk$ = this.hotelService.getSelectedDesk();
    this.deskItems$ = this.hotel$.pipe(map((hotel) => {
      return hotel ? hotel.desks : [];
    }));
  }
}
