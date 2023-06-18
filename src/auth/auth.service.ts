import {
  BadRequestException,
  ForbiddenException,
  Inject,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { RegisterDto } from '../dto/register.dto';
import { PrismaService } from '../prisma/prisma.service';
import * as randomatic from 'randomatic';
import * as bcrypt from 'bcryptjs';
import { LoginDto } from '../dto/login.dto';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { JwtStrategy } from '../strategy/jwt-strategy';
import { MailerService } from 'src/mailer/mailer.service';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly refreshTokenService: RefreshTokenService,
    private mailerService: MailerService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}
  async register(body: RegisterDto) {
    const passwordRegex = /^(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (!passwordRegex.test(body.password)) {
      throw new UnauthorizedException(
        'password must include both uppercase and lowercase characters and special characters',
      );
    }
    const salt = await bcrypt.genSaltSync(10);
    const hashedPassword = await bcrypt.hashSync(body.password, salt);
    const secret = randomatic('Aa0', 24);
    try {
      const user = await this.prisma.user.create({
        data: {
          email: body.email,
          hashedPassword,
          roles: body.roles,
          secret,
        },
        select: {
          id: true,
          email: true,
          roles: true,
          createdAt: true,
        },
      });
      const refreshToken = this.refreshTokenService.generateRefreshToken(
        user.id,
        secret,
      );
      return {
        message: 'Register successfully!',
        user: user,
        refreshToken: refreshToken,
      };
    } catch (error) {
      return error.message;
    }
  }
  async login(body: LoginDto) {
    const user = await this.prisma.user.findUnique({
      where: {
        email: body.email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    const passwordMatched = await bcrypt.compareSync(
      body.password,
      user.hashedPassword,
    );
    if (!passwordMatched) {
      throw new BadRequestException('Invalid password!');
    }
    delete user.hashedPassword;
    // const otp = randomatic('0', 8);
    // await this.cacheManager.set('otp', otp, 600);
    // await this.cacheManager.set('email', user.email, 900);
    // await this.mailerService.sendEmail(user.email, otp);
    // return {
    //   message: 'Send otp successfully!',
    // };
    return this.signJwtToken(user.id, user.email, user.roles, user.secret);
  }
  async loginTwoFactor(otp: string) {
    console.log('otp-factor:', otp);
    console.log('email-factor:', await this.cacheManager.get('email'));
    if (!(await this.cacheManager.get('email'))) {
      throw new NotFoundException('Otp is invalid! Please try again.');
    }
    const user = await this.prisma.user.findUnique({
      where: {
        email: await this.cacheManager.get('email'),
      },
    });
    return this.signJwtToken(user.id, user.email, user.roles, user.secret);
  }
  async loginWithGoogle(email: string) {
    const user = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });
    if (!user) {
      throw new NotFoundException('User not found!');
    }
    return this.signJwtToken(user.id, user.email, user.roles, user.secret);
  }
  async signJwtToken(
    userId,
    email,
    roles,
    secretKey,
  ): Promise<{ accessToken: string }> {
    const payload = {
      id: userId,
      email: email,
      roles: roles,
      exp: Math.floor(Date.now() / 1000) + 600,
    };
    // const jwtString = await this.jwtService.signAsync(payload);
    const token = JwtStrategy.generate(payload, secretKey);
    return {
      accessToken: token,
    };
  }
}
