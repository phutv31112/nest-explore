import { Module } from '@nestjs/common';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { PrismaModule } from './prisma/prisma.module';
import { JwtStrategy } from './strategy';
import { JwtModule } from '@nestjs/jwt';
import { RedisCacheModule } from './redis-cache/redis-cache.module';
import { PasswordResetService } from './password.reset/password.reset.service';
import { MailerModule } from './mailer/mailer.module';
import { CacheModule } from '@nestjs/cache-manager';
import { GoogleStrategy } from './strategy/google.strategy';
import { QrCodeModule } from './qr-code/qr-code.module';

@Module({
  imports: [
    AuthModule,
    UserModule,
    PrismaModule,
    JwtModule,
    MailerModule,
    CacheModule.register(),
    QrCodeModule,
  ],
  providers: [JwtStrategy, PasswordResetService, GoogleStrategy],
})
export class AppModule {}
