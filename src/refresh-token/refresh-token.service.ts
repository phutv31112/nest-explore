import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { jwtConstants } from '../constant/constants';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}
  async generateRefreshToken(userId: number): Promise<any> {
    try {
      const refreshToken = await this.jwtService.signAsync(
        { sub: userId },
        {
          secret: jwtConstants.secret,
          expiresIn: '2days',
        },
      );
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
  async refreshAccessToken(refreshToken: string): Promise<string> {
    try {
      const decoded = await this.jwtService.verifyAsync(refreshToken, {
        secret: jwtConstants.secret,
      });
      const userId = decoded.sub; // Lấy user ID từ decoded refresh token
      const user = await this.prisma.user.findUnique({
        where: { id: userId },
      });
      if (!user) {
        throw new Error('Invalid user');
      }

      // Tạo access token mới
      const accessToken = this.jwtService.sign({
        sub: userId,
        email: user.email,
        roles: user.roles,
      });
      console.log('access token: ', accessToken);
      return accessToken;
    } catch (error) {
      throw new Error('Invalid refresh token');
    }
  }
}
