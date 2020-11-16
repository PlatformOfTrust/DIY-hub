require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as cors from "cors";
import { Logger } from '@nestjs/common';
import { MikroORM } from '@mikro-orm/core';
import ormConfig from './mikro-orm.config'

const logger = new Logger('Main');

async function bootstrap() {
  logger.log("Running migrations...");
  const orm = await MikroORM.init(ormConfig);
  const migrator = orm.getMigrator();
  await migrator.up();
  await orm.close(true);
  logger.log("Migrations done");

  const app = await NestFactory.create(AppModule);
  let microserviceOptions: any = {
    url: process.env.MQTT_URL
  }
  if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
    microserviceOptions.username = process.env.MQTT_USERNAME;
    microserviceOptions.password = process.env.MQTT_PASSWORD;
  }
  app.connectMicroservice<MicroserviceOptions>({
    transport: Transport.MQTT,
    options: microserviceOptions
  });
  app.use(cors());
  await app.startAllMicroservicesAsync();
  await app.listen(process.env.PORT ? parseInt(process.env.PORT) : 3001);
}
bootstrap();
