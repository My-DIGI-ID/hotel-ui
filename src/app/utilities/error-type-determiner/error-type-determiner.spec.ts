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

import {ErrorTypeDeterminer} from './error-type-determiner';
import {HttpErrorResponse} from '@angular/common/http';

describe('ErrorTypeDeterminer', () => {
  it('IS_HTTP_ERROR_RESPONSE should return true if given HttpErrorResponse', () => {
    const httpErrorResponse = new HttpErrorResponse({
      error: 'any',
      status: 400,
      statusText: 'Something went wrong',
      url: 'test-url.com'
    });

    expect(ErrorTypeDeterminer.IS_HTTP_ERROR_RESPONSE(httpErrorResponse)).toBeTrue();
  });

  it('IS_ERROR_TYPE_BAD_REQUEST should return true if given error object with Bad Request type', () => {
    const errorBadRequest = {
      type: 'https://www.jhipster.tech/problem/problem-with-message',
      title: 'Bad Request',
      status: 400,
      detail: `400 BAD_REQUEST "A user with the given login already exists."`,
      path: '/api/users',
      message: 'error.http.40'
    };

    expect(ErrorTypeDeterminer.IS_ERROR_TYPE_BAD_REQUEST(errorBadRequest)).toBeTrue();
  });

  it('IS_ERROR_IP_BLOCKED should return true if given error object with error value other than 1, 2, or 3', () => {
    const loginAuthenticationError = {
      error: {
        id_token: '2021-06-17T09:55:27.969674Z'
      },
      message: 'Http failure response for http://localhost:8090/api/authenticate: 401 Unauthorized',
      name: 'HttpErrorResponse',
      ok: false,
      status: 401,
      statusText: 'Unauthorized',
      url: 'http://localhost:8090/api/authenticate'
    };

    expect(ErrorTypeDeterminer.IS_ERROR_IP_BLOCKED(loginAuthenticationError)).toBeTrue();

  });

  it('IS_ERROR_IP_BLOCKED should return false if given error object with error value 1, 2, or 3', () => {
    const testCases = ['1', '2', '3'];

    testCases.forEach((testCase) => {
      const loginAuthenticationError = {
        error: {
          id_token: testCase
        },
        message: 'Http failure response for http://localhost:8090/api/authenticate: 401 Unauthorized',
        name: 'HttpErrorResponse',
        ok: false,
        status: 401,
        statusText: 'Unauthorized',
        url: 'http://localhost:8090/api/authenticate'
      };

      expect(ErrorTypeDeterminer.IS_ERROR_IP_BLOCKED(loginAuthenticationError)).toBeFalse();
    });
  });
});
