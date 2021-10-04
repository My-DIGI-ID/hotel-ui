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

import {Component, OnInit, ApplicationRef} from '@angular/core';
import {Title} from '@angular/platform-browser';
import {AppConfigurationsService} from './services/app-configurations/app-configurations.service';
import {NavigationEnd, Router} from '@angular/router';
import {NotificationService} from 'carbon-components-angular';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  public constructor(private readonly title: Title,
                     private readonly appConfigurationsService: AppConfigurationsService,
                     private readonly router: Router,
                     private readonly notificationService: NotificationService,
                     private readonly applicationRef: ApplicationRef) {
  }

  public ngOnInit(): void {
    this.title.setTitle(this.appConfigurationsService.title || '');
    this.closeOpenNotificationsOnPageChange();
  }

  private closeOpenNotificationsOnPageChange(): void {
    this.router.events.subscribe((event: any) => {
      if (event instanceof NavigationEnd && this.notificationService.notificationRefs.length > 0) {
        this.notificationService.notificationRefs.forEach((notificationRef) => {
          this.applicationRef.detachView(notificationRef.hostView);
          notificationRef.destroy();
        });
      }
    });
  }
}
