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

import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ApplicationURL} from '../../../../utilities/application-url';

@Component({
  selector: 'app-notification-page',
  templateUrl: './notification-page.component.html',
  styleUrls: ['./notification-page.component.scss']
})
export class NotificationPageComponent {
  public success: boolean = false;

  private readonly successHeader: string = 'Data successfully sent to PMS';
  private readonly successText: string = 'Please proceed with next traveller waiting at your desk.';
  private readonly errorHeader: string = 'Data could not be sent to PMS';
  private readonly errorText: string = 'Please check your PMS and try again.';

  public constructor(public router: Router) {
    this.success = this.router.getCurrentNavigation()!.extras.state?.success;
  }

  public getHeaderText(): string {
    return this.success ? this.successHeader : this.errorHeader;
  }

  public getText(): string {
    return this.success ? this.successText : this.errorText;
  }

  public showCheckinCredentials(): void {
    this.router.navigateByUrl(ApplicationURL.CheckInCredentials);
  }
}
