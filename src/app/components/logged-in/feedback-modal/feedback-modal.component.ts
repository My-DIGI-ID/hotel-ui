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
import {BaseModal, ListItem, NotificationService} from 'carbon-components-angular';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {FormValidator} from '../../../utilities/form-validators/form-validator';
import {FeedbackService} from '../../../services/feedback/feedback.service';
import {FeedbackDTO} from '../../../../api-client';
import {ErrorNotification} from 'src/app/models/notifications/ErrorNotification';

@Component({
  selector: 'app-feedback-modal',
  templateUrl: './feedback-modal.component.html',
  styleUrls: ['./feedback-modal.component.scss']
})
export class FeedbackModalComponent extends BaseModal {
  public feedbackForm: FormGroup;
  public topics: ListItem[] = [
    {
      content: 'Issue',
      selected: false
    },
    {
      content: 'Comment',
      selected: false
    },
    {
      content: 'Question',
      selected: false
    }
  ];

  public constructor(public readonly formValidator: FormValidator,
                     private readonly formBuilder: FormBuilder,
                     private readonly feedbackService: FeedbackService,
                     private readonly notificationService: NotificationService) {
    super();

    this.feedbackForm = this.createFeedbackForm();
  }

  public cancel(): void {
    this.closeModal();
  }

  public async save(): Promise<void> {
    if (this.feedbackForm.valid) {
      const feedbackDTO = this.createFeedbackDTO();

      try {
        await this.feedbackService.create(feedbackDTO);

        this.closeModal();
      } catch (error: any) {
        this.notificationService.showNotification(new ErrorNotification());
      }
    }
  }

  private createFeedbackForm(): FormGroup {
    return this.formBuilder.group({
      topic: new FormControl('', [Validators.required]),
      feedback: new FormControl('', [
        Validators.required,
        Validators.minLength(15),
        Validators.maxLength(500),
        this.formValidator.requiredNoWhitespaceFill()
      ])
    });
  }

  private createFeedbackDTO(): FeedbackDTO {
    return {
      topic: this.feedbackForm.get('topic')!.value.content,
      feedback: this.formValidator.getSanitizedFormStringValue(this.feedbackForm.get('feedback')!)
    };
  }
}
