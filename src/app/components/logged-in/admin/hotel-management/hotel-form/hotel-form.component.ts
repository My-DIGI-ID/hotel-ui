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

import {Component, EventEmitter, Output, OnInit} from '@angular/core';
import {FormGroup, FormBuilder, FormControl, Validators, FormArray} from '@angular/forms';
import {ModalService, TableHeaderItem} from 'carbon-components-angular';
import {FormValidator} from 'src/app/utilities/form-validators/form-validator';
import {EditDeskModalComponent} from '../desk/edit-desk-modal/edit-desk-modal.component';
import {AddDeskModalComponent} from '../desk/add-desk-modal/add-desk-modal.component';
import {DeskDTO, HotelDTO} from 'src/api-client';
import {TableEntry} from '../../../../../utilities/table/TableEntry';
import {CurrentDesk} from 'src/app/utilities/current-desk/current-desk';

@Component({
  selector: 'app-hotel-form',
  templateUrl: './hotel-form.component.html',
  styleUrls: ['./hotel-form.component.scss']
})
export class HotelFormComponent implements OnInit {
  public hotelForm: FormGroup;
  public hotelFormDesks: FormArray;
  public tableData: TableEntry[][] = [];
  public tableHeaders: TableHeaderItem[] = [];
  public loading: boolean = true;
  public overflowMenuItems: {button: string, callback: any}[] = [
    {
      button: 'Edit',
      callback: this.openEditDeskModal()
    },
    {
      button: 'Delete',
      callback: this.deleteDesk()
    }
  ];

  @Output()
  private readonly submitForm: EventEmitter<void> = new EventEmitter<void>();

  @Output()
  private readonly discardForm: EventEmitter<void> = new EventEmitter<void>();

  public constructor(public readonly formValidator: FormValidator,
                     private readonly formBuilder: FormBuilder,
                     private readonly modalService: ModalService,
                     private readonly currentDesk: CurrentDesk) {
    this.hotelForm = this.createHotelForm();
    this.hotelFormDesks = this.hotelForm.get('desks') as FormArray;
  }

  public async ngOnInit(): Promise<void> {
    this.tableHeaders = this.createTableHeaders();
    this.tableData = this.createDesksTableData();
    this.loading = false;
  }

  public submit(): void {
    this.submitForm.emit();
  }

  public discard(): void {
    this.discardForm.emit();
  }

  public openAddNewDeskModal(): void {
    const addNewDeskModal = this.modalService.create({
      component: AddDeskModalComponent,
      inputs: {
        desks: this.hotelFormDesks
      }
    });

    addNewDeskModal.onDestroy(() => {
      const deskFormValue = addNewDeskModal.instance.deskFormValue;

      if (deskFormValue) {
        this.addNewDesk(deskFormValue.deskId, deskFormValue.deskName);
      }
    });
  }

  public openEditDeskModal(): (data: DeskDTO) => void {
    return (data: DeskDTO) => {
      const editDeskModal = this.modalService.create({
        component: EditDeskModalComponent,
        inputs: {
          deskName: data.name,
          desks: this.hotelFormDesks
        }
      });

      editDeskModal.onDestroy(() => {
        if (editDeskModal.instance.deskName) {
          this.updateDeskNameById(editDeskModal.instance.deskName, data.id);
        }
      });
    };
  }

  public deleteDesk(): (data: DeskDTO) => void {
    return (data: DeskDTO) => {
      if (this.currentDesk.getFromLocalStorage()?.id === data.id) {
        this.currentDesk.removeFromLocalStorage();
      }
      this.hotelFormDesks.controls = this.hotelFormDesks.controls.filter((desk) => desk.value.id !== data.id);
      this.tableData = this.createDesksTableData();
    };
  }

  public createDesksTableData(): TableEntry[][] {
    const tableData: TableEntry[][] = [];

    this.hotelFormDesks.controls.forEach((desk) => {
      tableData.push([
        new TableEntry({data: desk.value.name}),
        new TableEntry({data: {id: desk.value.id, name: desk.value.name}, template: undefined})
      ]);
    });

    return tableData;
  }

  public populateHotelForm(hotel: HotelDTO): void {
    this.hotelForm.patchValue({
      id: hotel.id,
      name: hotel.name,
      address: {
        street: hotel.address.street,
        houseNumber: hotel.address.houseNumber,
        postalCode: hotel.address.postalCode,
        city: hotel.address.city
      }
    });
    hotel.desks.forEach((desk) => {
      this.addNewDesk(desk.id, desk.name);
    });

    this.tableData = this.createDesksTableData();
  }

  public disableHotelIdField(): void {
    this.hotelForm.get('id')!.disable();
  }

  private createHotelForm(): FormGroup {
    return this.formBuilder.group({
      name: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.formValidator.requiredNoWhitespaceFill(),
        this.formValidator.forbiddenCharactersString()
      ]),
      id: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        this.formValidator.requiredNoWhitespaceFill(),
        this.formValidator.forbiddenCharactersId()
      ]),
      address: this.formBuilder.group({
        street: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString()
        ]),
        houseNumber: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString()
        ]),
        postalCode: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString()
        ]),
        city: new FormControl('', [
          Validators.required,
          Validators.maxLength(50),
          this.formValidator.requiredNoWhitespaceFill(),
          this.formValidator.forbiddenCharactersString()
        ])
      }),
      desks: this.formBuilder.array([])
    });
  }

  private createTableHeaders(): TableHeaderItem[] {
    return [
      new TableHeaderItem({data: 'Desks'}),
      new TableHeaderItem()
    ];
  }

  private addNewDesk(deskId: string, deskName: string): void {
    this.hotelFormDesks.push(
      this.formBuilder.group({
        id: [deskId, [Validators.required, this.formValidator.forbiddenCharactersId()]],
        name: [deskName, [Validators.required, this.formValidator.forbiddenCharactersString()]
        ]
      })
    );

    this.tableData = this.createDesksTableData();
  }

  private updateDeskNameById(newDeskName: string, deskId: string): void {
    this.hotelFormDesks.controls.forEach((desk) => {
      if (desk.value.id === deskId) {
        desk.get('name')!.setValue(newDeskName);
      }
    });

    if (this.currentDesk.getFromLocalStorage()?.id === deskId) {
      this.currentDesk.updateNameInLocalStorage(newDeskName);
    }

    this.tableData = this.createDesksTableData();
  }
}
