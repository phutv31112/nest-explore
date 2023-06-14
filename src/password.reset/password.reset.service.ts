import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';
import { MailerService } from '../mailer/mailer.service';
import * as agon from 'argon2';
import { RedisService } from 'nestjs-redis';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';
import * as randomatic from 'randomatic';

@Injectable()
export class PasswordResetService {
  constructor(
    private prisma: PrismaService,
    private mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async generateResetToken(email: string): Promise<string> {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new ForbiddenException('User is not found');
    }
    const resetToken = this.generateRandomToken();
    await this.mailerService.sendResetEmail(email, resetToken);
    // await this.rediService.getClient().set(`reset_token:${email}`, resetToken);
    await this.cacheManager.set(email, resetToken, 600);
    const value = await this.cacheManager.get(email);
    console.log('value:', value);
    return `resetToken: ${resetToken}`;
  }
  private generateRandomToken(): string {
    const resetToken = randomatic('Aa0', 10);
    return resetToken;
  }
  //   async verifyResetToken(email: string, resetToken: string): Promise<boolean> {
  //     const cachedToken = await this.rediService
  //       .getClient()
  //       .get(`reset_token:${email}`);
  //     return resetToken === cachedToken;
  //   }
  async resetPassword(email: string, resetToken: string): Promise<string> {
    // Kiểm tra xem resetToken có khớp trong Redis cache hay không
    try {
      const value = await this.cacheManager.get(email);
      if (value !== resetToken) {
        throw new Error('Reset token is invalid or expired');
      }
      const newPass = randomatic('Aa0', 9);
      const hashPass = await agon.hash(newPass);
      // Cập nhật mật khẩu mới trong cơ sở dữ liệu
      await this.prisma.user.update({
        where: { email },
        data: { hashedPassword: hashPass },
      });

      // Xóa resetToken từ Redis cache sau khi đã sử dụng
      await this.cacheManager.del(email);
      return `newPass: ${newPass}`;
    } catch (error) {
      return error;
    }
  }
}
