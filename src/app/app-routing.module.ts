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

import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './components/login/login.component';
import {DashboardComponent} from './components/logged-in/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {QrCodeComponent} from './components/logged-in/qr-code/qr-code.component';
import {CheckInCredentialsDetailsComponent} from './components/logged-in/check-in-credentials/check-in-credentials-details/check-in-credentials-details.component';
import {CheckInCredentialsOverviewComponent} from './components/logged-in/check-in-credentials/check-in-credentials-overview/check-in-credentials-overview.component';
import {HotelManagementComponent} from './components/logged-in/admin/hotel-management/hotel-management.component';
import {UserGuard} from './guards/user.guard';
import {BookingDataComparisonComponent} from './components/logged-in/booking-data-comparison/booking-data-comparison.component';
import {AdminGuard} from './guards/admin.guard';
import {AddHotelComponent} from './components/logged-in/admin/hotel-management/add-hotel/add-hotel.component';
import {NotificationPageComponent} from './components/logged-in/booking-data-comparison/notification-page/notification-page.component';
import {AddUserComponent} from './components/logged-in/admin/user-management/add-user/add-user.component';
import {UserManagementComponent} from './components/logged-in/admin/user-management/user-management.component';
import {EditHotelComponent} from './components/logged-in/admin/hotel-management/edit-hotel/edit-hotel.component';
import {EditUserComponent} from './components/logged-in/admin/user-management/edit-user/edit-user.component';
import {ApplicationURL} from './utilities/application-url';
import {LoggedOutGuard} from './guards/logged-out.guard';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login'
  },
  {
    path: ApplicationURL.Login,
    component: LoginComponent,
    canActivate: [LoggedOutGuard]
  },
  {
    path: ApplicationURL.Dashboard,
    component: DashboardComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: ApplicationURL.QrCode,
    component: QrCodeComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: ApplicationURL.CheckInCredentials,
    component: CheckInCredentialsOverviewComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: `${ApplicationURL.CheckInCredentials}/:id`,
    component: CheckInCredentialsDetailsComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: ApplicationURL.BookingDataComparison,
    component: BookingDataComparisonComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: ApplicationURL.BookingDataComparisonNotification,
    component: NotificationPageComponent,
    canActivate: [AuthGuard, UserGuard]
  },
  {
    path: ApplicationURL.AdminUserManagement,
    component: UserManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: `${ApplicationURL.AdminUserManagement}/:id/edit`,
    component: EditUserComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: ApplicationURL.AdminAddUser,
    component: AddUserComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: ApplicationURL.AdminHotelManagement,
    component: HotelManagementComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: ApplicationURL.AdminAddHotel,
    component: AddHotelComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: `${ApplicationURL.AdminHotelManagement}/:id/edit`,
    component: EditHotelComponent,
    canActivate: [AuthGuard, AdminGuard]
  },
  {
    path: '404',
    component: PageNotFoundComponent
  },
  {
    path: '**',
    redirectTo: ApplicationURL.PageNotFound
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
