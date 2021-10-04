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
import {DecodedJWToken} from '../../models/DecodedJWToken';
import jwtDecode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class Token {
  private readonly tokenStorageKey: string = 'TOKEN';

  public set(token: string): void {
    sessionStorage.setItem(this.tokenStorageKey, token);
  }

  public get(): string {
    const token = sessionStorage.getItem(this.tokenStorageKey);

    return token ? token : '';
  }

  public getDecoded(): DecodedJWToken | undefined {
    const token = this.get();

    if (token !== '') {
      return jwtDecode<DecodedJWToken>(token);
    }

    return undefined;
  }

  public remove(): void {
    sessionStorage.removeItem(this.tokenStorageKey);
  }

  public isValid(): boolean {
    const decodedToken = this.getDecoded();

    if (decodedToken) {
      const expiresAt = new Date(decodedToken.exp * 1000);

      return new Date() < expiresAt;
    }

    return false;
  }
}
