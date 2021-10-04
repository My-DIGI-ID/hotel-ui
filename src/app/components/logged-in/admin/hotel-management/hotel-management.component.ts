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

import {Component, OnInit} from '@angular/core';
import {Router} from '@angular/router';
import {TableHeaderItem, ModalService, ModalButtonType} from 'carbon-components-angular';
import {HotelDTO} from '../../../../../api-client';
import {HotelService} from '../../../../services/hotel/hotel.service';
import {ApplicationURL} from '../../../../utilities/application-url';
import {WarningModalComponent} from '../../warning-modal/warning-modal.component';
import {TableEntry} from '../../../../utilities/table/TableEntry';

@Component({
  selector: 'app-hotel-management',
  templateUrl: './hotel-management.component.html',
  styleUrls: ['./hotel-management.component.scss']
})
export class HotelManagementComponent implements OnInit {
  public loading: boolean = true;
  public hotels?: HotelDTO[];
  public tableData: TableEntry[][] = [];
  public tableHeader: TableHeaderItem[] = [];
  public overflowMenuItems: {button: string, callback: any}[] = [
    {
      button: 'Edit',
      callback: this.editHotel()
    },
    {
      button: 'Delete',
      callback: this.deleteHotel()
    }
  ];

  public constructor(private readonly modalService: ModalService,
                     private readonly hotelService: HotelService,
                     private readonly router: Router) {
  }

  public async ngOnInit(): Promise<void> {
    this.hotels = await this.getAllHotels();
    this.tableHeader = this.createTableHeaders();
    this.tableData = this.createTableData();
    this.loading = false;
  }

  public showAddHotel(): void {
    this.router.navigateByUrl(ApplicationURL.AdminAddHotel);
  }

  public editHotel(): (data: {hotelId: string}) => void {
    return (data: {hotelId: string}) => {
      this.router.navigate(['admin/hotel-management/', data.hotelId, 'edit']);
    };
  }

  public deleteHotel(): (data: {hotelId: string}) => void {
    return (data: {hotelId: string}) => {
      const modalRef = this.modalService.create(
        {
          component: WarningModalComponent,
          inputs: {
            label: '',
            title: 'Please confirm deletion of this Hotel',
            modalText: 'Are you sure you want to delete this Hotel from the system?',
            cancelButton: {text: 'Cancel', type: ModalButtonType.secondary},
            submitButton: {text: 'Delete', type: ModalButtonType.danger}
          }
        });

      modalRef.onDestroy(() => {
        if (modalRef.instance.returnValue) {
          this.deleteHotelFromDatabase(data.hotelId);
        }
      });
    };
  }

  private async getAllHotels(): Promise<HotelDTO[]> {
    return await this.hotelService.getAllHotels();
  }

  private createTableData(): TableEntry[][] {
    const tableData: TableEntry[][] = [];

    this.hotels?.forEach((hotel) => {
      if (hotel) {
        tableData.push([
          new TableEntry({data: hotel.name}),
          new TableEntry({data: hotel.desks.length}),
          new TableEntry({data: {hotelId: hotel.id}, template: undefined})
        ]);
      }
    });

    return tableData;
  }

  private createTableHeaders(): TableHeaderItem[] {
    return [
      new TableHeaderItem({data: 'Hotel Name'}),
      new TableHeaderItem({data: 'Desks'}),
      new TableHeaderItem()
    ];
  }

  private async deleteHotelFromDatabase(hotelId: string): Promise<void> {
    await this.hotelService.deleteHotel(hotelId);

    this.hotels = await this.getAllHotels();
    this.tableData = this.createTableData();
  }
}
