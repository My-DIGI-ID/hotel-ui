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

import {Component, Inject} from '@angular/core';
import {FormGroup, FormBuilder, Validators, FormControl, FormArray} from '@angular/forms';
import {BaseModal} from 'carbon-components-angular';
import {DeskValidator} from 'src/app/utilities/form-validators/desk-validator';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';

@Component({
  selector: 'app-edit-desk-modal',
  templateUrl: './edit-desk-modal.component.html',
  styleUrls: ['./edit-desk-modal.component.scss']
})
export class EditDeskModalComponent extends BaseModal {
  public deskForm: FormGroup;

  public constructor(@Inject('deskName')
                     public deskName: string,
                     @Inject('desks')
                     public desks: FormArray,
                     public readonly formValidator: FormValidator,
                     public readonly deskValidator: DeskValidator,
                     private readonly formBuilder: FormBuilder) {
    super();

    this.deskForm = this.createDeskForm();
    this.populateDeskName(deskName);
  }

  public cancel(): any {
    this.closeModal();
  }

  public save(): any {
    this.deskName = this.formValidator.getSanitizedFormStringValue(this.deskForm.get('deskName')!);

    this.closeModal();
  }

  private createDeskForm(): FormGroup {
    return this.formBuilder.group({
      deskName: new FormControl('', [
        Validators.required,
        Validators.maxLength(100),
        this.formValidator.requiredNoWhitespaceFill(),
        this.formValidator.forbiddenCharactersString(),
        this.deskValidator.notUniqueDeskName(this.desks)
      ])
    });
  }

  private populateDeskName(deskName: string): void {
    this.deskForm.get('deskName')!.setValue(deskName);
  }
}
