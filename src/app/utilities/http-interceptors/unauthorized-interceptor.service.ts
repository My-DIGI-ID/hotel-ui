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
import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {Router} from '@angular/router';
import {StatusCode} from '../status-codes/status-code';
import {ApplicationURL} from '../application-url';
import {AuthService} from '../../services/auth/auth.service';

@Injectable()
export class UnauthorizedInterceptor implements HttpInterceptor {
  private readonly loginRoute: string = ApplicationURL.Login;

  public constructor(private readonly router: Router,
                     private readonly authService: AuthService) {
  }

  public intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error) => {
        if (error instanceof HttpErrorResponse && error.status === StatusCode.Unauthorized) {
          this.authService.logOut();
          this.router.navigate([this.loginRoute]);
        }

        return throwError(error);
      })
    );
  }
}
