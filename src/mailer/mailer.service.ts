import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as nodemailer from 'nodemailer';

@Injectable()
export class MailerService {
  private transporter;
  constructor(private configService: ConfigService) {
    this.transporter = nodemailer.createTransport({
      host: this.configService.get('HOST_MAILTRAP'),
      port: this.configService.get('PORT_MAILTRAP'),
      secure: false,
      auth: {
        user: this.configService.get('USER_MAILTRAP'),
        pass: this.configService.get('PASS_MAILTRAP'),
      },
    });
  }
  async sendEmail(email: string, message: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('HOST_MAILTRAP'),
      to: email,
      subject: message,
      text: `message: ${message}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Send email successfully!');
    } catch (error) {
      console.error('Error sending reset email', error);
    }
  }
}
