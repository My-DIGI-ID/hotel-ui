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
import {WarningModalComponent} from './warning-modal.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('WarningModalComponent', () => {
  let component: WarningModalComponent;
  let fixture: ComponentFixture<WarningModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [WarningModalComponent],
      providers: [
        {
          provide: 'title',
          useValue: 'Title'
        },
        {
          provide: 'modalText',
          useValue: 'This is a modal text'
        },
        {
          provide: 'cancelButton',
          useValue: {
            text: 'Cancel',
            type: 'secondary'
          }
        },
        {
          provide: 'submitButton',
          useValue: {
            text: 'Submit',
            type: 'danger'
          }
        },
        {
          provide: 'returnValue',
          useValue: false
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(WarningModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('it should have Cancel button with correct data', () => {
    expect(component.cancelButton?.text).toBe('Cancel');
    expect(component.cancelButton?.type).toBe('secondary');
  });

  it('it should have Submit button with correct data', () => {
    expect(component.submitButton?.text).toBe('Submit');
    expect(component.submitButton?.type).toBe('danger');
  });

  it('if I click the cancel button, the return value should be false', () => {
    component.cancelButtonClick();

    fixture.detectChanges();

    expect(component.returnValue).toBeFalse();
  });

  it('if I click the submit button, the return value should be true', () => {
    component.submitButtonClick();

    fixture.detectChanges();

    expect(component.returnValue).toBeTrue();
  });

  it('if I close the modal, the return value should be false', () => {
    component.closeModal();

    fixture.detectChanges();

    expect(component.returnValue).toBeFalse();
  });
});
