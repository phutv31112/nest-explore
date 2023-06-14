import { QrCodeService } from './qr-code.service';
import { Controller, Get, Param, Res } from '@nestjs/common';
import { Response } from 'express';

@Controller('qr-code')
export class QrCodeController {
  constructor(private qrService: QrCodeService) {}
  @Get(':data')
  async generateQrCode(@Param('data') data: string, @Res() res: Response) {
    try {
      const qrCodeUrl = await this.qrService.generateQrCode(data);
      return res.send(`<img src="${qrCodeUrl}" alt="QR Code">`);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to generate QR code' });
    }
  }
}
