import { Injectable } from '@nestjs/common';
import * as qrcode from 'qrcode';
@Injectable()
export class QrCodeService {
  generateQrCode(data: string): Promise<string> {
    return new Promise((resolve, reject) => {
      qrcode.toDataURL(data, (err, url) => {
        if (err) {
          reject(err);
        } else {
          resolve(url);
        }
      });
    });
  }
}
