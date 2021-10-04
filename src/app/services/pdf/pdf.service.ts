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
import {QrCodePDFTemplate} from './qrcode-pdf-template';
import {QrCodeService} from '../../services/qr-code/qr-code.service';
import {HotelService} from '../hotel/hotel.service';

@Injectable({
  providedIn: 'root'
})

export class PDFService {
  public pdfMake: any;
  public logo: any;
  public urlString: string = '';
  public deskName: string = '';
  public hotelName: string = '';

  public constructor(private readonly qrCodeService: QrCodeService,
                     private readonly hotelService: HotelService) {
    this.qrCodeService.getURL().subscribe((item) => {
      this.urlString = item;
    });

    this.hotelService.getSelectedDesk().subscribe((desk) => {
      this.deskName = desk?.name;
    });

    this.hotelService.getHotel().subscribe((hotel) => {
      this.hotelName = hotel?.name;
    });
  }

  public async loadPDFMaker(): Promise<void> {
    if (!this.pdfMake) {
      // @ts-ignore
      const pdfMakeModule = await import('../../../../node_modules/pdfmake/build/pdfmake');
      // @ts-ignore
      const pdfFontsModule = await import('../../../../node_modules/pdfmake/build/vfs_fonts');

      this.pdfMake = pdfMakeModule.default;
      this.pdfMake.vfs = pdfFontsModule.default.pdfMake.vfs;
    }
    await this.convertImageToBase64('../../../assets/pictograms/bee.png');
  }

  private async convertImageToBase64(path: string): Promise<void> {
    return new Promise<void>((resolve) => {
      const canvas = document.createElement('canvas');
      const img = document.createElement('img');

      img.src = path;
      img.onload = () => {
        canvas.height = img.height;
        canvas.width = img.width;
        const context = canvas.getContext('2d');
        if (context !== null) {
          context.drawImage(img, 0, 0);
        }
        const dataURL = canvas.toDataURL('image/png');
        this.logo = dataURL;

        resolve();
      };
    });
  }

  public async generateQRCodePDF(): Promise<void> {
    await this.loadPDFMaker();

    const qrCodePDF = {
      pageMargins: [40, 100, 40, 40],
      header: () => (new QrCodePDFTemplate().getHeader(this.hotelName, this.deskName)),
      content: new QrCodePDFTemplate().get(this.urlString),
      images: {logo: this.logo},
      styles: new QrCodePDFTemplate().getStyle()
    };

    try {
      this.pdfMake.createPdf(qrCodePDF).open();
    } catch (error) {
      console.error('Open PDF in new window blocked - maybe due to the browser popup blocker', error);
    }
  }
}
