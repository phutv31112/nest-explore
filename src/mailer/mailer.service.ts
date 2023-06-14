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
  async sendResetEmail(email: string, resetToken: string): Promise<void> {
    const mailOptions = {
      from: this.configService.get('HOST_MAILTRAP'),
      to: email,
      subject: resetToken,
      text: `Reset token: ${resetToken}`,
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log('Reset email sent successfully');
    } catch (error) {
      console.error('Error sending reset email', error);
    }
  }
}
