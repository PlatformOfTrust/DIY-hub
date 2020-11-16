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
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';

@Module({
  imports: [
    MikroOrmModule.forRoot(ormConfig),
    RuuvitagModule,
    SensorsModule,
    PlatformOfTrustModule,
    InfluxModule,
    ReadingsModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'ui'),
    })
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
