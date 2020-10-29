import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { RuuvitagModule } from './ruuvitag/ruuvitag.module';
import ormConfig from './mikro-orm.config';
import { SensorsModule } from './sensors/sensors.module';
import { PlatformOfTrustModule } from './platformoftrust/platformoftrust.module';
import { InfluxModule } from './influx/influx.module';
import { ReadingsModule } from './readings/readings.module';

@Module({
  imports: [
    MikroOrmModule.forRoot(ormConfig),
    RuuvitagModule,
    SensorsModule,
    PlatformOfTrustModule,
    InfluxModule,
    ReadingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
