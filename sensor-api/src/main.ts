require('dotenv').config()
import { NestFactory } from '@nestjs/core';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { AppModule } from './app.module';
import * as cors from "cors";

async function bootstrap() {
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
  await app.listen(3001);
}
bootstrap();
