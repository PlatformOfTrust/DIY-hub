import { Controller, Inject, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { RUUVITAG_SERVICE } from './ruuvitag.constants';

const ruuvi = require("node-ruuvitag");

interface Reading {
  identifier: string,
  data: any
}

@Controller()
export class RuuvitagController implements OnApplicationBootstrap {
  constructor(@Inject(RUUVITAG_SERVICE) private readonly client: ClientProxy) {}

  private readonly logger = new Logger(RuuvitagController.name);
  
  onApplicationBootstrap() {
    ruuvi.on('found', tag => {
      this.logger.log(`Discoreved ruuvitag with identifier ${tag.id}`);
      this.client.emit(`${process.env.MQTT_TOPIC_PREFIX}/ruuvitag/found`, { identifier: tag.id });
      tag.on('updated', data => {
        this.logger.log(`Ruuvitag with identifier ${tag.id} sent data`);
        const reading: Reading = {
          identifier: tag.id,
          data: data
        };
        this.client.emit(`${process.env.MQTT_TOPIC_PREFIX}/ruuvitag/update`, reading);
      });
    });
  }
}