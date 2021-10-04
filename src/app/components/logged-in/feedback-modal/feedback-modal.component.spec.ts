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

import {ComponentFixture, TestBed} from '@angular/core/testing';
import {FeedbackModalComponent} from './feedback-modal.component';
import {FormValidator} from '../../../utilities/form-validators/form-validator';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DropdownModule, NotificationService} from 'carbon-components-angular';
import {By} from '@angular/platform-browser';
import Spy = jasmine.Spy;

class FormValidatorMock {
  public isFormControlInvalidAfterTouch(formControl: any): boolean {
    return false;
  }

  public requiredNoWhitespace(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  // tslint:disable-next-line:no-identical-functions
  public requiredNoWhitespaceFill(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  public getSanitizedFormStringValue(control: any): any {
    return control.value;
  }

  public getSanitizedRawFormValues(form: any): any {
    return form.getRawValue();
  }
}

describe('FeedbackModalComponent', () => {
  let component: FeedbackModalComponent;
  let fixture: ComponentFixture<FeedbackModalComponent>;
  let hotelServiceSpy: Spy;

  beforeEach(async () => {
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      imports: [
        DropdownModule,
        ReactiveFormsModule,
        HttpClientTestingModule
      ],
      declarations: [FeedbackModalComponent],
      providers: [
        {
          provide: FormValidator,
          usaClass: FormValidatorMock
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FeedbackModalComponent);
    component = fixture.componentInstance;
    hotelServiceSpy = spyOn(component['feedbackService'], 'create').and.callThrough();

    fixture.detectChanges();
  });

  it('should be created successfully', () => {
    expect(component).toBeTruthy();
  });

  it('I should be able to see Topic field', () => {
    const topicDropdown = fixture.debugElement.query(By.css('#topic-dropdown'));

    expect(topicDropdown).toBeTruthy();
  });

  it('I should be able to see Feedback field', () => {
    const feedbackField = fixture.debugElement.query(By.css('textarea#feedback'));

    expect(feedbackField).toBeTruthy();
  });

  it('if I click on Submit button, and form is invalid, feedback should be not submitted', () => {
    const submitButton = fixture.debugElement.query(By.css('#submit-feedback-button')).nativeElement;
    const feedbackDTO = {
      topic: '',
      feedback: ''
    };

    component.feedbackForm.get('topic')!.setValue({content: feedbackDTO.topic});
    component.feedbackForm.get('feedback')!.setValue(feedbackDTO.feedback);
    fixture.detectChanges();

    submitButton.click();

    expect(hotelServiceSpy).toHaveBeenCalledTimes(0);
  });

  it('if I click on Submit button, and form is valid, feedback should be submitted', () => {
    const submitButton = fixture.debugElement.query(By.css('#submit-feedback-button')).nativeElement;
    const feedbackDTO = {
      topic: 'Issue',
      feedback: 'This is valid feedback'
    };

    component.feedbackForm.get('topic')!.setValue({content: feedbackDTO.topic});
    component.feedbackForm.get('feedback')!.setValue(feedbackDTO.feedback);
    fixture.detectChanges();

    submitButton.click();

    expect(hotelServiceSpy).toHaveBeenCalledOnceWith(feedbackDTO);
  });
});
