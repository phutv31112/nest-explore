import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { jwtConstants } from '../constant/constants';
import { PrismaService } from '../prisma/prisma.service';
import * as randomatic from 'randomatic';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor(private prisma: PrismaService) {
    super({
      clientID: jwtConstants.clientID,
      clientSecret: jwtConstants.clientSecret,
      callbackURL: 'http://localhost:9999/auth/google/callback',
      scope: ['profile', 'email'],
    });
  }
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: any,
    done: VerifyCallback,
  ): Promise<any> {
    // Tại đây, bạn có thể thực hiện xác thực tài khoản Google và kiểm tra thông tin người dùng
    // Đồng thời, bạn cũng có thể tạo hoặc tìm kiếm người dùng trong cơ sở dữ liệu
    const email = profile.emails[0].value;
    const user = await this.prisma.user.findUnique({ where: { email } });
    const password = randomatic('Aa0!', 8);
    if (!user) {
      // Tạo người dùng mới trong cơ sở dữ liệu
      const newUser = await this.prisma.user.create({
        data: { email, hashedPassword: password },
      });
      return done(null, newUser);
    }

    return done(null, user);
    // done(null, profile);
  }
}
