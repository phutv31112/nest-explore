import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../../constant/constants';
import { JwtStrategy } from '../../strategy/jwt-strategy';
import { use } from 'passport';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async generateRefreshToken(userId: number, secret: string): Promise<any> {
    try {
      const payload = {
        sub: userId,
        exp: Math.floor(Date.now() / 1000) + 864000,
      };
      const refreshToken = JwtStrategy.generate(payload, secret);
      await this.prisma.refreshToken.create({
        data: {
          token: refreshToken,
          userId,
        },
      });
      return refreshToken;
    } catch (error) {
      return error;
    }
  }
  async validateRefreshToken(token: string): Promise<boolean> {
    try {
      const refreshToken = await this.prisma.refreshToken.findUnique({
        where: {
          token: token,
        },
      });
      return !!refreshToken;
    } catch (error) {
      return false;
    }
  }
  async refreshAccessToken(
    refreshToken: string,
    secret: string,
  ): Promise<string> {
    try {
      const decoded = JwtStrategy.verify(refreshToken, secret);
      const userId = decoded.sub; // Lấy user ID từ decoded refresh token
      const user = await this.prisma.user.findUnique({
        where: { id: Number(userId) },
      });
      if (!user) {
        throw new Error('Invalid user');
      }

      // Tạo access token mới
      const payload = {
        id: userId,
        email: user.email,
        roles: user.roles,
        exp: Math.floor(Date.now() / 1000) + 600,
      };
      const accessToken = JwtStrategy.generate(payload, secret);
      return accessToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
