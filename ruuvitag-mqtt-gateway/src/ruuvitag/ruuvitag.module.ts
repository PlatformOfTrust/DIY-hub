import { Module } from '@nestjs/common';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { RUUVITAG_SERVICE } from './ruuvitag.constants';
import { RuuvitagController } from './ruuvitag.controller';

@Module({
  imports: [
    ClientsModule.register([{ 
      name: RUUVITAG_SERVICE,
      transport: Transport.MQTT,
      options: {
        url: process.env.MQTT_URL,
        username: process.env.MQTT_USERNAME,
        password: process.env.MQTT_PASSWORD
      }
    }]),
  ],
  controllers: [RuuvitagController],
})
export class RuuvitagModule {}