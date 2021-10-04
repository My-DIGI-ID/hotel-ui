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

import {APP_INITIALIZER, NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {RouterModule} from '@angular/router';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {AppConfigurationsService} from './services/app-configurations/app-configurations.service';
import {QrCodeComponent} from './components/logged-in/qr-code/qr-code.component';
import {QRCodeModule} from 'angularx-qrcode';
import {ApiModule, Configuration} from '../api-client';
import {Token} from './utilities/token/token';
import {LoginComponent} from './components/login/login.component';
import {GridModule, ButtonModule, NFormsModule, DropdownModule, TableModule, DialogModule, ModalModule, PlaceholderModule, NotificationModule, LinkModule, ComboBoxModule, PaginationModule} from 'carbon-components-angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {FormValidator} from './utilities/form-validators/form-validator';
import {CarbonIconsModule} from './modules/carbon-icons.module';
import {DashboardComponent} from './components/logged-in/dashboard/dashboard.component';
import {AuthGuard} from './guards/auth.guard';
import {UnauthorizedInterceptor} from './utilities/http-interceptors/unauthorized-interceptor.service';
import {HeaderComponent} from './components/header/header.component';
import {DatePipe} from '@angular/common';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CheckInCredentialsOverviewComponent} from './components/logged-in/check-in-credentials/check-in-credentials-overview/check-in-credentials-overview.component';
import {MasterIdComponent} from './components/logged-in/check-in-credentials/check-in-credentials-details/master-id/master-id.component';
import {CheckInCredentialsDetailsComponent} from './components/logged-in/check-in-credentials/check-in-credentials-details/check-in-credentials-details.component';
import {CorporateIdComponent} from './components/logged-in/check-in-credentials/check-in-credentials-details/corporate-id/corporate-id.component';
import {BookingDataComparisonComponent} from './components/logged-in/booking-data-comparison/booking-data-comparison.component';
import {BookingMasterIdComponent} from './components/logged-in/booking-data-comparison/booking-master-id/booking-master-id.component';
import {BookingCorporateIdComponent} from './components/logged-in/booking-data-comparison/booking-corporate-id/booking-corporate-id.component';
import {BookingsComponent} from './components/logged-in/check-in-credentials/check-in-credentials-details/bookings/bookings.component';
import {BookingDataComponent} from './components/logged-in/booking-data-comparison/booking-data/booking-data.component';
import {NotificationPageComponent} from './components/logged-in/booking-data-comparison/notification-page/notification-page.component';
import {HotelManagementComponent} from './components/logged-in/admin/hotel-management/hotel-management.component';
import {WarningModalComponent} from './components/logged-in/warning-modal/warning-modal.component';
import {AddHotelComponent} from './components/logged-in/admin/hotel-management/add-hotel/add-hotel.component';
import {BookingSearchComponent} from './components/logged-in/check-in-credentials/check-in-credentials-details/booking-search/booking-search.component';
import {ContactModalComponent} from './components/login/contact-modal/contact-modal.component';
import {FooterComponent} from './components/footer/footer.component';
import {FeedbackModalComponent} from './components/logged-in/feedback-modal/feedback-modal.component';
import {TableComponent} from './components/logged-in/table/table.component';
import {EditHotelComponent} from './components/logged-in/admin/hotel-management/edit-hotel/edit-hotel.component';
import {EditDeskModalComponent} from './components/logged-in/admin/hotel-management/desk/edit-desk-modal/edit-desk-modal.component';
import {AddDeskModalComponent} from './components/logged-in/admin/hotel-management/desk/add-desk-modal/add-desk-modal.component';
import {HotelFormComponent} from './components/logged-in/admin/hotel-management/hotel-form/hotel-form.component';
import {AddUserComponent} from './components/logged-in/admin/user-management/add-user/add-user.component';
import {UserManagementComponent} from './components/logged-in/admin/user-management/user-management.component';
import {EditUserComponent} from './components/logged-in/admin/user-management/edit-user/edit-user.component';
import {UserFormComponent} from './components/logged-in/admin/user-management/user-form/user-form.component';
import {AutofocusDirective} from './utilities/directives/autofocus.directive';
import {PageNotFoundComponent} from './components/page-not-found/page-not-found.component';
import {DeskValidator} from './utilities/form-validators/desk-validator';

@NgModule({
  declarations: [
    AppComponent,
    QrCodeComponent,
    LoginComponent,
    DashboardComponent,
    HeaderComponent,
    CheckInCredentialsDetailsComponent,
    CorporateIdComponent,
    MasterIdComponent,
    BookingsComponent,
    BookingDataComponent,
    CheckInCredentialsOverviewComponent,
    AddUserComponent,
    BookingDataComparisonComponent,
    BookingMasterIdComponent,
    BookingCorporateIdComponent,
    UserManagementComponent,
    NotificationPageComponent,
    HotelManagementComponent,
    WarningModalComponent,
    AddHotelComponent,
    AddDeskModalComponent,
    BookingSearchComponent,
    ContactModalComponent,
    FooterComponent,
    FeedbackModalComponent,
    TableComponent,
    EditHotelComponent,
    EditDeskModalComponent,
    HotelFormComponent,
    EditUserComponent,
    UserFormComponent,
    AutofocusDirective,
    PageNotFoundComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    ApiModule,
    HttpClientModule,
    RouterModule,
    ReactiveFormsModule,
    FormsModule,
    QRCodeModule,
    CarbonIconsModule,
    NFormsModule,
    ButtonModule,
    BrowserAnimationsModule,
    GridModule,
    TableModule,
    DropdownModule,
    DialogModule,
    ModalModule,
    PlaceholderModule,
    NotificationModule,
    LinkModule,
    PaginationModule,
    ComboBoxModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      deps: [AppConfigurationsService],
      useFactory: (appConfigurationsService: AppConfigurationsService) => async () => appConfigurationsService.loadConfigurations(),
      multi: true
    },
    {
      provide: Configuration,
      useFactory: (token: Token, appConfigurationsService: AppConfigurationsService) => new Configuration(
        {
          basePath: appConfigurationsService.controllerAPIUrl,
          withCredentials: appConfigurationsService.withCredentials,
          accessToken: token.get.bind(token)
        }
      ),
      deps: [Token, AppConfigurationsService],
      multi: false
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: UnauthorizedInterceptor,
      multi: true
    },
    FormValidator,
    DeskValidator,
    AuthGuard,
    DatePipe
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
