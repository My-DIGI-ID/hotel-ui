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

import {HttpErrorResponse} from '@angular/common/http';
import {StatusCode} from '../status-codes/status-code';

export class ErrorTypeDeterminer {
  private static readonly BAD_REQUEST_TYPE: string = 'https://www.jhipster.tech/problem/problem-with-message';

  public static IS_HTTP_ERROR_RESPONSE(httpErrorResponse: any): boolean {
    return httpErrorResponse instanceof HttpErrorResponse;
  }

  public static IS_ERROR_TYPE_BAD_REQUEST(error: any): boolean {
    return error.status === StatusCode.BadRequest && error.type === this.BAD_REQUEST_TYPE;
  }

  public static IS_ERROR_IP_BLOCKED(error: any): boolean {
    return error.error.id_token !== '3' && error.error.id_token !== '2' && error.error.id_token !== '1';
  }
}
