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

import {Component, Inject, Optional} from '@angular/core';
import {BaseModal, ButtonType} from 'carbon-components-angular';

@Component({
  selector: 'app-warning-modal',
  templateUrl: './warning-modal.component.html',
  styleUrls: ['./warning-modal.component.scss']
})
export class WarningModalComponent extends BaseModal {
  public returnValue: boolean = false;

  public constructor(@Optional()
                     @Inject('label') public label?: string,
                     @Inject('title') public title?: string,
                     @Inject('modalText') public modalText?: string,
                     @Inject('cancelButton') public cancelButton?: {text: string, type: ButtonType},
                     @Inject('submitButton') public submitButton?: {text: string, type: ButtonType}) {
    super();
  }

  public cancelButtonClick(): void {
    this.returnValue = false;
    this.closeModal();
  }

  public submitButtonClick(): void {
    this.returnValue = true;
    this.closeModal();
  }
}
