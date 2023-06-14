import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ChangePassDto } from '../dto/change-pass.dto';
import * as agon from 'argon2';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}
  async getAllUser() {
    return await this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
      },
    });
  }
  async changePassword(user, body: ChangePassDto) {
    const userDb = await this.prisma.user.findUnique({
      where: {
        email: user.email,
      },
    });
    const passwordMatched = await agon.verify(
      userDb.hashedPassword,
      body.password,
    );
    if (!passwordMatched) {
      throw new UnauthorizedException('Password mismatch!');
    }
    if (body.newPassword === body.password) {
      throw new UnauthorizedException(
        'New password cannot be same as old password!',
      );
    }
    const hashedPassword = await agon.hash(body.newPassword);
    await this.prisma.user.update({
      where: {
        email: user.email,
      },
      data: {
        hashedPassword,
      },
    });
    return {
      message: 'Change password successfully!',
    };
  }
}
