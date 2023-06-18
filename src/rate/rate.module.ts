import { Module } from '@nestjs/common';
import { RateService } from './rate.service';
import { RateController } from './rate.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [RateService],
  controllers: [RateController],
})
export class RateModule {}
