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
import {LoginComponent} from './login.component';
import {ReactiveFormsModule, ValidatorFn} from '@angular/forms';
import {HttpClientTestingModule} from '@angular/common/http/testing';
import {FormValidator} from '../../utilities/form-validators/form-validator';
import {AuthService} from '../../services/auth/auth.service';
import {LoginVM} from '../../../api-client';
import {By} from '@angular/platform-browser';
import {GridModule, ModalService, PlaceholderModule} from 'carbon-components-angular';
import {Router} from '@angular/router';
import {throwError} from 'rxjs';
import {DebugElement} from '@angular/core';

class FormValidatorMock {
  public isFormControlInvalidAfterTouch(formControl: any): boolean {
    return false;
  }

  public requiredNoWhitespace(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  // tslint:disable-next-line:no-identical-functions
  public requiredNoWhitespaceFill(): ValidatorFn {
    return (control: any): { [key: string]: boolean } | null => {
      return null;
    };
  }

  public getSanitizedFormStringValue(control: any): any {
    return control.value;
  }

  public getSanitizedRawFormValues(form: any): any {
    return form.getRawValue();
  }
}

describe('LoginComponent', () => {
  let loginComponent: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let router: Router;
  let errorNotification: DebugElement;
  let testCases: string[];
  const validUsername = 'username';
  const validPassword = 'password';
  const loginButtonId = '#login-button';

  beforeEach(async () => {
    const routerMock = jasmine.createSpyObj('Router', ['navigateByUrl']);
    const loginServiceMock = {
      login: async (credentials: LoginVM): Promise<void> => {
        if (credentials.username === validUsername &&
            credentials.password === validPassword) {
          return;
        }
        throw new Error('401: Unauthorized');
      }
    };
    const modalServiceMock = jasmine.createSpyObj('ModalService', ['create', 'destroy']);

    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        GridModule,
        PlaceholderModule
      ],
      declarations: [LoginComponent],
      providers: [
        {
          provide: FormValidator,
          useCalue: FormValidatorMock
        },
        {
          provide: AuthService,
          useValue: loginServiceMock
        },
        {
          provide: Router,
          useValue: routerMock
        },
        {
          provide: ModalService,
          useValue: modalServiceMock
        }
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);

    loginComponent = fixture.componentInstance;
    router = TestBed.inject(Router);

    fixture.detectChanges();
  });

  it('instance should be successfully created', () => {
    expect(loginComponent).toBeTruthy();
  });

  it('login form should consist of username and password', () => {
    const loginForm = loginComponent.loginForm;

    expect(loginForm.contains('username')).toBe(true);
    expect(loginForm.contains('password')).toBe(true);
  });

  describe('I should not be able to submit the form', () => {
    it('without the username', () => {
      const loginButton = fixture.debugElement.query(By.css(loginButtonId));

      loginComponent.loginForm.controls.password.setValue('f24-gj905-sokg');
      fixture.detectChanges();

      expect(loginButton.nativeElement.getAttribute('disabled')).toEqual('');
    });

    it('without the password', () => {
      const loginButton = fixture.debugElement.query(By.css(loginButtonId));

      loginComponent.loginForm.controls.username.setValue('user@ssi.com');
      fixture.detectChanges();

      expect(loginButton.nativeElement.getAttribute('disabled')).toEqual('');
    });

    it('if user IP is blocked', () => {
      const loginButton = fixture.debugElement.query(By.css(loginButtonId));

      loginComponent.loginBlocked = true;
      expect(loginButton.nativeElement.getAttribute('disabled')).toEqual('');
    });

  });

  it('I should be able to submit the form after I have filled the username and password, if user id is not blocked', () => {
    loginComponent.loginForm.controls.username.setValue('user@ssi.com');
    loginComponent.loginForm.controls.password.setValue('*195%#891!');
    loginComponent.loginBlocked = false;

    fixture.detectChanges();

    const loginButton = fixture.debugElement.query(By.css(loginButtonId));

    expect(loginButton.nativeElement.getAttribute('disabled')).toBeNull();
  });

  it('on successful login, I should be taken to dashboard page', async () => {
    loginComponent.loginForm.controls.username.setValue(validUsername);
    loginComponent.loginForm.controls.password.setValue(validPassword);

    await loginComponent.login();

    expect(router.navigateByUrl).toHaveBeenCalledWith('dashboard');
  });

  describe('on first 3 unsucessful logins ', () => {
    beforeEach(() => {
      loginComponent.loginForm.controls.username.setValue('invalidUsername');
      loginComponent.loginForm.controls.password.setValue('invalidPassword');
      testCases = ['1', '2', '3'];
    });

    it('I should see the login error', async () => {
      try {
        await loginComponent.login();
      } catch (error) {
        testCases.forEach((testCase) => {
          throwError({
            error: {
              id_token: testCase
            }
          });
          expect(loginComponent.loginForm.get('password')!.hasError('credentialsError')).toBeTrue();
        });
      }
    });

    it('I should not be redirected to dashboard', async () => {
      try {
        await loginComponent.login();
      } catch (error) {
        testCases.forEach((testCase) => {
          throwError({
            error: {
              id_token: testCase
            }
          });
          expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
        });
      }
    });

    it('I should not see "login attempts exceeded" error', async () => {
      loginComponent.loginBlocked = false;

      fixture.detectChanges();

      errorNotification = fixture.debugElement.query(By.css('#login-attempt-error'));
      expect(errorNotification).toBeNull();
    });
  });

  describe ('if the IP of my user is blocked ', () => {
    beforeEach(() => {
      loginComponent.loginBlocked = true;
      loginComponent['showErrorNotification']('');

      fixture.detectChanges();

      errorNotification = fixture.debugElement.query(By.css('#login-attempt-error'));
    });

    it('i should see "login attempts exceeded" error', () => {
      expect(errorNotification).toBeTruthy();
    });

    it('I should not be redirected to dashboard', () => {
      expect(router.navigateByUrl).toHaveBeenCalledTimes(0);
    });
  });
});
