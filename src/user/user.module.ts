import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { APP_GUARD } from '@nestjs/core';
import { RolesGuard } from '../guard/roles.guard';
import { JwtStrategy } from 'src/strategy';
import { JwtModule } from '@nestjs/jwt';
import { UserService } from './user.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [JwtModule, PrismaModule],
  controllers: [UserController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: RolesGuard,
    },
    JwtStrategy,
    UserService,
  ],
  exports: [UserService],
})
export class UserModule {}
