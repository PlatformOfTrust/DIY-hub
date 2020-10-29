import { Module } from '@nestjs/common';
import { RuuvitagController } from './ruuvitag.controller';
import { InfluxModule } from 'src/influx/influx.module';
import { SensorsModule } from 'src/sensors/sensors.module';

@Module({
  imports: [
    SensorsModule,
    InfluxModule
  ],
  controllers: [RuuvitagController],
})
export class RuuvitagModule {}