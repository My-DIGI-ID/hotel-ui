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

import {TableItem} from 'carbon-components-angular';
import {SortType} from './SortType';

export class TableEntry extends TableItem {
  public readonly sortType: SortType = SortType.Default;

  private readonly dynamicSortValue?: () => any;
  private readonly sortValue?: any;

  public constructor(rawData?: any) {
    super(rawData);

    if (rawData.hasOwnProperty('dynamicSortValue')) {
      this.dynamicSortValue = rawData.dynamicSortValue;
      this.sortType = SortType.Dynamic;
    } else if (rawData.hasOwnProperty('sortValue')) {
      this.sortValue = rawData.sortValue;
      this.sortType = SortType.Static;
    }
  }

  public getSortValue(): any {
    switch (this.sortType) {
      case SortType.Dynamic:
        return this.dynamicSortValue ? this.dynamicSortValue() : null;
      case SortType.Static:
        return this.sortValue;
      default:
        return this.data;
    }
  }
}
