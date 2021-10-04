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

export class QrCodePDFTemplate {
  public getHeader(hotelName: string, deskName: string): any {
    return {
      table: {
        widths: [30, 330, '*'],
        body: [[
          {
            border: [false, false, false, true],
            stack: [{image: 'logo', width: 35}],
            margin: [0, 6, 0, 0]
          },
          {
            border: [false, false, false, true],
            stack: [{text: hotelName, width: 100}],
            margin: [10, 15, 0, 20]
          },
          {
            border: [false, false, false, true],
            stack: [{text: deskName}],
            margin: [10, 15, 0, 20],
            fontSize: 10
          }
        ]]
      },
      margin: [40, 40, 40, 0]
    };
  }

  public getStyle(): any {
    return {
      mainText: {
        fontSize: 30
      },
      subText: {
        fontSize: 20
      }
    };
  }

  public get(qrCodeAsUrl: string): any {
    return [
      {
        qr: qrCodeAsUrl,
        fit: '300',
        margin: [110, 40, 40, 40]
      },
      {
        text: 'QR-Code scannen',
        style: 'mainText',
        margin: [110, 0, 40, 40]
      },
      {
        text: 'Bitte scannen Sie mit ihrer Wallet den QR-Code',
        style: 'subText',
        margin: [110, 0, 40, 40]
      }
    ];
  }
}
