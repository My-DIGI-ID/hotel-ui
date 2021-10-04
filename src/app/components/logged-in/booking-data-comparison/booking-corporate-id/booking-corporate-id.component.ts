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

import {Component, Input} from '@angular/core';
import {CorporateIdDTO} from '../../../../../api-client';

@Component({
  selector: 'app-booking-corporate-id',
  templateUrl: './booking-corporate-id.component.html',
  styleUrls: ['./booking-corporate-id.component.scss']
})
export class BookingCorporateIdComponent {
  @Input()
  public corporateId?: CorporateIdDTO;

  public copyToClipboard(toCopy: CorporateIdDTO | string | undefined): void {
    const copyValue = this.getCopyValue(toCopy);
    const ghostTextArea = document.createElement('textarea');

    ghostTextArea.value = copyValue;
    ghostTextArea.setAttribute('readonly', '');
    ghostTextArea.style.position = 'absolute';
    ghostTextArea.style.right = '-99999px';

    document.body.appendChild(ghostTextArea);
    ghostTextArea.focus();
    ghostTextArea.select();
    document.execCommand('copy');
    document.body.removeChild(ghostTextArea);
  }

  private getCopyValue(toCopy: CorporateIdDTO | string | undefined): string {
    let copyValue = '';

    if (typeof toCopy === 'object') {
      for (const [, value] of Object.entries(toCopy)) {
        if (value.length) {
          copyValue += value + '; ';
        }
      }
      copyValue = copyValue.slice(0, -2);
    } else if (typeof toCopy === 'string') {
      copyValue = toCopy;
    }

    return copyValue;
  }
}
