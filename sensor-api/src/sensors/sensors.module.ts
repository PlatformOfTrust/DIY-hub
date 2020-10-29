import { Module } from '@nestjs/common';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Sensor } from 'src/entities';
import { SensorsController } from './sensors.controller';
import { SensorService } from './sensors.service';

@Module({
  imports: [
    MikroOrmModule.forFeature({
      entities: [Sensor]
    })
  ],
  controllers: [SensorsController],
  providers: [SensorService],
  exports: [SensorService]
})
export class SensorsModule {}