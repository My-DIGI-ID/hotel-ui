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
import {CheckInCredentialsOverviewComponent} from './check-in-credentials-overview.component';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {DatePipe} from '@angular/common';
import {RouterTestingModule} from '@angular/router/testing';
import {Pipe, PipeTransform} from '@angular/core';
import {NotificationService, PlaceholderModule} from 'carbon-components-angular';
import {TableComponent} from '../../table/table.component';

@Pipe({name: 'MockPipe'})
class MockPipe implements PipeTransform {
  public transform(value: string): string {
    return '';
  }
}

describe('CheckinCredentialsOverviewComponent', () => {
  let component: CheckInCredentialsOverviewComponent;
  let fixture: ComponentFixture<CheckInCredentialsOverviewComponent>;

  beforeEach(async () => {
    const notificationServiceMock = jasmine.createSpyObj('NotificationService', ['showNotification']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        PlaceholderModule
      ],
      declarations: [
        CheckInCredentialsOverviewComponent,
        TableComponent
      ],
      providers: [
        {
          provide: DatePipe,
          use: MockPipe
        },
        {
          provide: NotificationService,
          useValue: notificationServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckInCredentialsOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
