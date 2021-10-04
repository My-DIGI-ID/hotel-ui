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

import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {TableHeaderItem, TableModel} from 'carbon-components-angular';
import {reverse, sortBy} from 'lodash';
import {TableEntry} from '../../../utilities/table/TableEntry';
import {SortType} from '../../../utilities/table/SortType';

@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.scss']
})
export class TableComponent implements OnInit, OnChanges {
  @Input()
  public tableTitle?: string;

  @Input()
  public tableDescription?: string;

  @Input()
  public overflowMenuItems?: {button: string, callback: any}[];

  @Input()
  public searchEnabled: boolean = true;

  @Input()
  public paginationEnabled: boolean = true;

  @Input()
  public unpaginatedTableData: TableEntry[][] = [];

  @Input()
  public tableDataHeader: TableHeaderItem[] = [];

  @Input()
  public striped: boolean = false;

  @Input()
  public singleSelectEnabled: boolean = false;

  @Input()
  public addButtonEnabled: boolean = false;

  @Input()
  public addButtonCaption: string = '';

  @Input()
  public isLoading: boolean = false;

  @Input()
  public emptyTableMessage: string = 'No data has been received.';

  @Input()
  public showSelectionColumn: boolean = false;

  @Output()
  public addToTable: EventEmitter<any> = new EventEmitter<any>();

  @ViewChild('overflowMenuItemTemplate', {static: true})
  private readonly overflowMenuItemTemplate?: TemplateRef<any>;

  public searchString: string = '';
  public tableModel: TableModel = new TableModel();
  public noDataReceivedColumnLength?: number;

  private unpaginatedSearchTableData: TableEntry[][] = [];

  public ngOnInit(): void {
    this.setCurrentPage(1);
  }

  public ngOnChanges(changes: SimpleChanges): void {
    if (changes.hasOwnProperty('tableDataHeader')) {
      this.updateTablesHeaderData();
    }
    if (changes.hasOwnProperty('unpaginatedTableData')) {
      this.updateTableWithUnpaginatedTableData();
    }
  }

  public sortTable(columnIndex: number): void {
    if (this.tableDataHeader[columnIndex].sorted) {
      this.tableDataHeader[columnIndex].ascending = this.tableDataHeader[columnIndex].descending;
    }

    if (this.unpaginatedTableData[0][columnIndex].sortType === SortType.Dynamic) {
      this.sortDynamicColumn(columnIndex);
    } else {
      this.sortStaticColumn(columnIndex);
    }

    this.tableDataHeader.forEach((header, index) => {
      header.sorted = columnIndex === index;
    });

    this.updateTableWithUnpaginatedTableData();
  }

  public setTableDataForSearchString(searchString: string): void {
    this.searchString = searchString;

    if (this.searchString) {
      this.unpaginatedSearchTableData = this.getDataMatchingSearchString(searchString);
    }

    this.setCurrentPage(1);
  }

  public clearSearchString(): void {
    this.setTableDataForSearchString('');
  }

  public setCurrentPage(page: number): void {
    this.tableModel.currentPage = page;

    this.setTableDataForCurrentPage();
  }

  private updateTableWithUnpaginatedTableData(): void {
    if (this.isOverflowMenuEnabled() && this.tableDataHeader.length) {
      this.unpaginatedTableData = this.addOverflowMenu(this.unpaginatedTableData);
    }
    if (this.searchString) {
      this.unpaginatedSearchTableData = this.getDataMatchingSearchString(this.searchString);
    }
    if (!this.paginationEnabled) {
      this.tableModel.pageLength = this.unpaginatedTableData.length;
    }

    this.setCurrentPage(this.tableModel.currentPage);
  }

  private isOverflowMenuEnabled(): boolean {
    return this.overflowMenuItems !== undefined;
  }

  private addOverflowMenu(tableData: TableEntry[][]): TableEntry[][] {
    this.tableDataHeader[this.tableDataHeader.length - 1].sortable = false;

    return tableData.map((row) => {
      row[row.length - 1].template = this.overflowMenuItemTemplate!;

      return row;
    });
  }

  private setTableDataForCurrentPage(): void {
    const start = (this.tableModel.currentPage - 1) * this.tableModel.pageLength;
    const end = start + this.tableModel.pageLength;

    if (this.searchString) {
      this.updateTableData(this.unpaginatedSearchTableData.slice(start, end), this.unpaginatedSearchTableData);
    } else {
      this.updateTableData(this.unpaginatedTableData.slice(start, end), this.unpaginatedTableData);
    }
  }

  private updateTableData(data: TableEntry[][], unpaginatedData: TableEntry[][]): void {
    this.tableModel.data = data;
    this.tableModel.totalDataLength = unpaginatedData.length;
  }

  private getDataMatchingSearchString(searchString: string): TableEntry[][] {
    return this.unpaginatedTableData.filter((tableRow) => {
      const isMatch = (tableEntry: TableEntry) => {
        return typeof tableEntry.data === 'string' &&
          tableEntry.data.toLowerCase().includes(searchString.toLowerCase());
      };

      return tableRow.some(isMatch);
    });
  }

  private updateTablesHeaderData(): void {
    this.tableModel.header = this.tableDataHeader;
    this.noDataReceivedColumnLength = this.showSelectionColumn ? (this.tableModel.header.length + 1) : this.tableModel.header.length;
  }

  private sortStaticColumn(columnIndex: number): void {
    if (this.tableDataHeader[columnIndex].sorted) {
      this.unpaginatedTableData = reverse(this.unpaginatedTableData);
    } else {
      this.sortUnpaginatedTableData(columnIndex);
    }
  }

  private sortDynamicColumn(columnIndex: number): void {
    this.sortUnpaginatedTableData(columnIndex);

    if (this.tableDataHeader[columnIndex].descending) {
      this.unpaginatedTableData = reverse(this.unpaginatedTableData);
    }
  }

  private sortUnpaginatedTableData(columnIndex: number): void {
    this.unpaginatedTableData = sortBy(this.unpaginatedTableData, (row) => {
      return row[columnIndex].getSortValue();
    });
  }
}
