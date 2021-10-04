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

import {Component, EventEmitter, Output} from '@angular/core';
import {FormValidator} from '../../../../../utilities/form-validators/form-validator';
import {FormBuilder, FormControl, FormGroup, Validators} from '@angular/forms';
import {ListItem} from 'carbon-components-angular';
import {UserDTO} from '../../../../../../api-client';

@Component({
  selector: 'app-user-form',
  templateUrl: './user-form.component.html',
  styleUrls: ['./user-form.component.scss']
})
export class UserFormComponent {
  @Output()
  private readonly submitForm: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  private readonly discardForm: EventEmitter<void> = new EventEmitter<void>();

  public userForm: FormGroup;
  public hotels: ListItem[] = [];
  public filteredHotels: ListItem[] = [];
  public passwordInputValueHidden: boolean = true;

  public constructor(public readonly formValidator: FormValidator,
                     private readonly formBuilder: FormBuilder) {
    this.userForm = this.createUserForm();
  }

  public submit(): void {
    this.submitForm.emit();
  }

  public discard(): void {
    this.discardForm.emit();
  }

  public togglePasswordVisibility(): void {
    if (!this.userForm.get('password')!.disabled) {
      this.passwordInputValueHidden = !this.passwordInputValueHidden;
    }
  }

  public disablePasswordField(): void {
    this.userForm.get('password')!.disable();
  }

  public onSearch(searchText: string): void {
    this.filteredHotels = searchText.length === 0 ? this.hotels : this.hotels.filter((hotel) => {
      return hotel.content.toLowerCase().includes(searchText.toLowerCase());
    });
  }

  public populateForm(user: UserDTO): void {
    this.userForm.get('login')!.setValue(user.login);
    this.userForm.get('firstName')?.setValue(user.firstname);
    this.userForm.get('lastName')!.setValue(user.lastname);
    this.userForm.get('email')!.setValue(user.email);
    this.userForm.get('hotel')!.setValue(this.hotels.find((hotel) => hotel.id === user.hotelId));
  }

  private createUserForm(): FormGroup {
    return this.formBuilder.group({
      login: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.formValidator.forbiddenCharactersId()
      ]),
      firstName: new FormControl('', [
        Validators.maxLength(50),
        this.formValidator.forbiddenCharactersString()
      ]),
      lastName: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.formValidator.requiredNoWhitespaceFill(),
        this.formValidator.forbiddenCharactersString()
      ]),
      email: new FormControl('', [
        Validators.required,
        Validators.minLength(5),
        Validators.maxLength(254),
        Validators.email,
        this.formValidator.requiredNoWhitespaceFill(),
        this.formValidator.requiredNoWhitespace()
      ]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(50),
        this.formValidator.forbiddenCharactersPassword(),
        this.formValidator.requiredStrongPassword()
      ]),
      hotel: new FormControl('', [Validators.required])
    });
  }
}
