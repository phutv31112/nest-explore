import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { PrismaModule } from '../prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from '../constant/constants';
import { JwtStrategy } from '../strategy';
import { RefreshTokenService } from './refresh-token/refresh-token.service';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../guard/roles.guard';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RedisModule } from 'nestjs-redis';
import { MailerModule } from '@nestjs-modules/mailer';
import { PasswordResetService } from '../password.reset/password.reset.service';
import { MailerService } from '../mailer/mailer.service';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleStrategy } from '../strategy/google.strategy';
import { PassportModule } from '@nestjs/passport';
import { CommentModule } from '../comment/comment.module';

@Module({
  imports: [
    PrismaModule,
    CommentModule,
    MailerModule,
    ConfigModule,
    CacheModule.register(),
    PassportModule.register({ defaultStrategy: 'google' }),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '10m' },
    }),
    // RedisModule.forRootAsync({
    //   imports: [ConfigModule],
    //   useFactory: async (configService: ConfigService) => ({
    //     host: configService.get('REDIS_HOST'),
    //     port: configService.get('REDIS_PORT'),
    //     auth_pass: configService.get('REDIS_PASSWORD'),
    //     ttl: configService.get('REDIS_TTL'),
    //   }),
    //   inject: [ConfigService],
    // }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtStrategy,
    MailerService,
    ConfigService,
    RefreshTokenService,
    PasswordResetService,
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    GoogleStrategy,
  ],
})
export class AuthModule {}
