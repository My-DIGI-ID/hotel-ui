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
import {TableComponent} from './table.component';
import {TableHeaderItem} from 'carbon-components-angular';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {By} from '@angular/platform-browser';
import {SimpleChange} from '@angular/core';
import {TableEntry} from '../../../utilities/table/TableEntry';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;
  const validTableDataHeader = [
    new TableHeaderItem({visible: false}),
    new TableHeaderItem({data: 'First name'}),
    new TableHeaderItem({data: 'Last name'}),
    new TableHeaderItem({data: 'Company'}),
    new TableHeaderItem({data: 'Scan date'}),
    new TableHeaderItem({data: 'Scan time'})
  ];
  const validUnpaginatedTableData = [[
    new TableEntry({data: '123'}),
    new TableEntry({data: 'Jason'}),
    new TableEntry({data: 'Smith'}),
    new TableEntry({data: 'State Department'}),
    new TableEntry({data: '11/04/2020'}),
    new TableEntry({data: '12:12 am'})
  ]];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [TableComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('I should see the add new button', () => {
    component.addButtonEnabled = true;

    fixture.detectChanges();

    const addNewButton = fixture.debugElement.query(By.css('#add-new-table-row-button'));

    expect(addNewButton).toBeTruthy();
  });

  it('I should see the rows containing data with a field that includes my search term', () => {
    component.tableDataHeader = validTableDataHeader;
    component.unpaginatedTableData = validUnpaginatedTableData;
    component.searchEnabled = true;
    const validSearchTerm = 'Jason';

    component.setTableDataForSearchString(validSearchTerm);

    fixture.detectChanges();

    expect(component.tableModel.data[0][1].data).toEqual('Jason');
  });

  it('I should not see any rows if none of the rows\' fields include my search term', () => {
    component.tableDataHeader = validTableDataHeader;
    component.unpaginatedTableData = validUnpaginatedTableData;
    component.searchEnabled = true;
    const invalidSearchTerm = 'qqqq';

    component.setTableDataForSearchString(invalidSearchTerm);

    fixture.detectChanges();

    expect(component.tableModel.data[0][0]).toBeUndefined();
  });

  it('if there is no data retrieved after loading I should see the no data text', () => {
    component.unpaginatedTableData = [[]];
    component.isLoading = false;

    fixture.detectChanges();

    const hotelManagementEmptyTableText = fixture.debugElement.query(By.css('#empty-table-text'));

    expect(hotelManagementEmptyTableText).toBeTruthy();
  });

  describe('If I have data in the table', () => {
    beforeEach(() => {
      component.searchEnabled = true;
      component.paginationEnabled = true;
      component.tableDataHeader = validTableDataHeader;
      component.unpaginatedTableData = validUnpaginatedTableData;

      fixture.detectChanges();
      component.ngOnChanges({
        tableDataHeader: new SimpleChange(new TableHeaderItem(), validTableDataHeader, true),
        unpaginatedTableData: new SimpleChange([[]], validUnpaginatedTableData, true)
      });
      fixture.detectChanges();
    });

    describe('the table header', () => {
      it('should contain 6 elements', () => {
        expect(component.tableModel.header.length).toEqual(6);
      });

      it('should hide the first cell', () => {
        expect(component.tableModel.header[0].data).toEqual('');
      });

      it('should show in the second cell the first name', () => {
        expect(component.tableModel.header[1].data).toEqual('First name');
      });

      it('should show in the second cell the last name', () => {
        expect(component.tableModel.header[2].data).toEqual('Last name');
      });

      it('should show in the third cell the company', () => {
        expect(component.tableModel.header[3].data).toEqual('Company');
      });

      it('should show in the fourth cell the scan date', () => {
        expect(component.tableModel.header[4].data).toEqual('Scan date');
      });

      it('should show in the fifth cell the scan time', () => {
        expect(component.tableModel.header[5].data).toEqual('Scan time');
      });
    });

    describe('the first row', () => {
      it('should contain 6 elements', async () => {
        expect(component.tableModel.row(0).length).toEqual(6);
      });

      it('should store in the first cell the id', () => {
        expect(component.tableModel.data[0][0].data).toEqual('123');
      });

      it('should show in the second cell the first name', () => {
        expect(component.tableModel.data[0][1].data).toEqual('Jason');
      });

      it('should show in the third cell the last name', () => {
        expect(component.tableModel.data[0][2].data).toEqual('Smith');
      });

      it('should show in the fourth cell the company', () => {
        expect(component.tableModel.data[0][3].data).toEqual('State Department');
      });

      it('should show in the fifth cell the scan date', () => {
        expect(component.tableModel.data[0][4].data).toEqual('11/04/2020');
      });

      it('should show in the sixth cell the scan time', () => {
        expect(component.tableModel.data[0][5].data).toEqual('12:12 am');
      });
    });
  });

  it('if I click the add new button, addToTable should be emitted', () => {
    component.addButtonEnabled = true;
    const addToTableSpy = spyOn(component['addToTable'], 'emit');

    fixture.detectChanges();
    fixture.debugElement.query(By.css('#add-new-table-row-button')).nativeElement.click();

    expect(addToTableSpy).toHaveBeenCalledTimes(1);
  });
});
