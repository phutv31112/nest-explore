import { CacheModule, Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { PasswordResetService } from './password.reset/password.reset.service';
import { MailerModule } from './mailer/mailer.module';
import { GoogleStrategy } from './strategy/google.strategy';
import { QrCodeModule } from './qr-code/qr-code.module';
import { ProductModule } from './product/product.module';
import { CommentModule } from './comment/comment.module';
import { RateModule } from './rate/rate.module';
import { ConfigModule, ConfigService } from '@nestjs/config';

import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JwtModule,
    MailerModule,
    CacheModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        store: redisStore,
        host: configService.get('REDIS_HOST'),
        port: configService.get('REDIS_PORT'),
      }),
    }),
    QrCodeModule,
    ProductModule,
    CommentModule,
    RateModule,
  ],
  providers: [JwtStrategy, PasswordResetService, GoogleStrategy],
})
export class AppModule {}
