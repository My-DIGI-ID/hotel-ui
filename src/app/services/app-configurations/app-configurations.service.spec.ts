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

import {TestBed} from '@angular/core/testing';
import {AppConfigurationsService} from './app-configurations.service';

describe('AppConfigurationsService', () => {
  let appConfigurationsService: AppConfigurationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AppConfigurationsService]
    });

    appConfigurationsService = TestBed.inject(AppConfigurationsService);
  });

  it('should be created', () => {
    expect(appConfigurationsService).toBeTruthy();
  });

  it ('should fetch configurations.json', async () => {
    spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response('{}')));

    await appConfigurationsService.loadConfigurations();

    expect(window.fetch).toHaveBeenCalledWith(appConfigurationsService['configurationsPath']);
  });

  describe('should set all config fields to values from configurations file', () => {
    beforeEach(async () => {
      const appConfigurationsString = `{
        "SSIBK_HOTEL_UI_LOGO_URL": "logourl",
        "SSIBK_HOTEL_UI_CONTROLLER_APIURL": "apiurl",
        "SSIBK_HOTEL_UI_CONTROLLER_EXTERNAL_APIURL": "external-apiurl",
        "SSIBK_HOTEL_UI_TITLE": "title",
        "SSIBK_HOTEL_UI_VERSION": "version"
      }`;
      spyOn(window, 'fetch').and.returnValue(Promise.resolve(new Response(appConfigurationsString)));

      await appConfigurationsService.loadConfigurations();
    });

    it(`title should be set to 'title'`, () => {
      expect(appConfigurationsService.title).toEqual('title');
    });

    it(`logoUrl should be set to 'logourl'`, () => {
      expect(appConfigurationsService.logoUrl).toEqual('logourl');
    });

    it(`controllerAPIUrl should be set to 'apiurl'`, () => {
      expect(appConfigurationsService.controllerAPIUrl).toEqual('apiurl');
    });

    it(`controllerExternalAPIUrl should be set to 'external-apiurl'`, () => {
      expect(appConfigurationsService.controllerExternalAPIUrl).toEqual('external-apiurl');
    });

    it(`version should be set to 'version'`, () => {
      expect(appConfigurationsService.version).toEqual('version');
    });
  });
});
