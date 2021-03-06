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
import {PageNotFoundComponent} from './page-not-found.component';
import {RouterTestingModule} from '@angular/router/testing';
import Spy = jasmine.Spy;

describe('PageNotFoundComponent', () => {
  let component: PageNotFoundComponent;
  let fixture: ComponentFixture<PageNotFoundComponent>;
  let routerSpy: Spy;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [PageNotFoundComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PageNotFoundComponent);
    component = fixture.componentInstance;
    routerSpy = spyOn(component['router'], 'navigateByUrl');

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(component).toBeTruthy();
  });

  it('after I call the navigate back method, I should be taken to the dashboard page', () => {
    component.navigateToDashboard();

    expect(routerSpy).toHaveBeenCalledOnceWith('dashboard');
  });
});
