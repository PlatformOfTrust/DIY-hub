import { Module } from '@nestjs/common';
import { PlatformOfTrustController } from './platformoftrust.controller';
import { RsaService } from './rsa.service';
import { InfluxModule } from 'src/influx/influx.module';

@Module({
  imports: [InfluxModule],
  providers: [RsaService],
  controllers: [PlatformOfTrustController],
})
export class PlatformOfTrustModule {}