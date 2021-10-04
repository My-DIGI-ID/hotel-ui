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
import {FooterComponent} from './footer.component';
import {By} from '@angular/platform-browser';
import {ModalService} from 'carbon-components-angular';
import {ReplaySubject} from 'rxjs';
import {HttpClientTestingModule} from '@angular/common/http/testing';

describe('FooterComponent', () => {
  let footerComponent: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  const loggedIn = new ReplaySubject<boolean>(1);

  beforeEach(async () => {
    const modalServiceMock = jasmine.createSpyObj('ModalService', ['create', 'destroy']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule
      ],
      declarations: [FooterComponent],
      providers: [
        {
          provide: ModalService,
          useValue: modalServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FooterComponent);
    footerComponent = fixture.componentInstance;
    footerComponent.currentUser.loggedIn$ = loggedIn;

    fixture.detectChanges();
  });

  it('should be successfully created', () => {
    expect(footerComponent).toBeTruthy();
  });

  it('if I am logged in, I should be able to open Feedback modal', () => {
    loggedIn.next(true);
    fixture.detectChanges();

    fixture.debugElement.query(By.css('#feedback-link')).nativeElement.click();

    expect(footerComponent['modalService'].create).toHaveBeenCalledTimes(1);
  });

  it('if I am logged out, I should not be able to see Feedback link', () => {
    loggedIn.next(false);
    fixture.detectChanges();

    const feedbackLink = fixture.debugElement.query(By.css('#feedback-link'));

    expect(feedbackLink).toBeFalsy();
  });
});
