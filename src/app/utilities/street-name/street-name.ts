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

import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StreetName {
  private readonly streetAbbreviations: string[] = [
    'straße',
    'strasse',
    'str'
  ];

  public sanitizeForComparison (street?: string): string | void {
    if (street) {
      let streetName = this.getStreetName(street).toLowerCase();
      this.streetAbbreviations.forEach((abbreviation: string) => {
        if (streetName.endsWith(abbreviation)) {
          streetName = streetName.substring(0, streetName.indexOf(abbreviation));
        }
      });

      return streetName + this.getHouseNumber(street).replace(/[-.\s]/g, '');
    }
  }

  private getStreetName(street: string): string {
    const houseNumber = this.getHouseNumber(street);
    const streetName = street.replace(houseNumber, '');

    return streetName.replace(/[-.\s]/g, '');
  }

  private getHouseNumber(street: string): string {
    return street.substring(street.search(/\d/), street.length);
  }
}
