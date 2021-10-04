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
import {ModalService} from 'carbon-components-angular';
import {AppConfigurationsService} from 'src/app/services/app-configurations/app-configurations.service';
import {CurrentUser} from '../../utilities/user/current-user/current-user';
import {FeedbackModalComponent} from '../logged-in/feedback-modal/feedback-modal.component';
import {ContactModalComponent} from '../login/contact-modal/contact-modal.component';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {
  public version?: string = this.config.version;

  public constructor(public readonly currentUser: CurrentUser,
                     private readonly modalService: ModalService,
                     private readonly config: AppConfigurationsService) {
  }

  public openFeedbackModal(): void {
    this.modalService.create({component: FeedbackModalComponent});
  }

  public showContactModal(): void {
    this.modalService.create({component: ContactModalComponent});
  }
}
