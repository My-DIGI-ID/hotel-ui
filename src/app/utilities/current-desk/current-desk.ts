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
import {DeskDTO} from 'src/api-client';

@Injectable({
  providedIn: 'root'
})
export class CurrentDesk {
  private readonly deskStorageKey: string = 'CURRENT_DESK';

  public getFromLocalStorage(): DeskDTO | null {
    return this.isSetInLocalStorage() ? JSON.parse(localStorage.getItem(this.deskStorageKey)!) : null;
  }

  public setInLocalStorage(currentDesk: DeskDTO): void {
    localStorage.setItem(this.deskStorageKey, JSON.stringify(currentDesk));
  }

  public isSetInLocalStorage(): boolean {
    return localStorage.getItem(this.deskStorageKey) !== null;
  }

  public removeFromLocalStorage(): void {
    localStorage.removeItem(this.deskStorageKey);
  }

  public updateNameInLocalStorage(name: string): void {
    const currentDesk = this.getFromLocalStorage();
    localStorage.setItem(this.deskStorageKey, JSON.stringify({'id': currentDesk?.id, 'name': name}));
  }
}
