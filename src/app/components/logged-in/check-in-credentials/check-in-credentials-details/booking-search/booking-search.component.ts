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

import {Component, Output, EventEmitter} from '@angular/core';
import {FormGroup, FormControl, Validators, FormBuilder} from '@angular/forms';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';

@Component({
  selector: 'app-booking-search',
  templateUrl: './booking-search.component.html',
  styleUrls: ['./booking-search.component.scss']
})
export class BookingSearchComponent {
  @Output()
  public searchString: EventEmitter<string> = new EventEmitter<string>();

  public searchForm: FormGroup;

  public constructor(public readonly formValidator: FormValidator,
                     private readonly formBuilder: FormBuilder) {
    this.searchForm = this.createSearchForm();
  }

  public createSearchForm(): FormGroup {
    return this.formBuilder.group({
      bookingNumber: new FormControl('', [
        Validators.required,
        this.formValidator.requiredNoWhitespaceFill(),
        this.formValidator.forbiddenCharactersString()
      ])
    });
  }

  public emitSearchString(): void {
    const searchStringValue = this.formValidator.getSanitizedFormStringValue(this.searchForm.get('bookingNumber')!);

    this.searchString.emit(searchStringValue);
  }
}
