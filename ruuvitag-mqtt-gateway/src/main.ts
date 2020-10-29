require('dotenv').config();
import { NestFactory } from '@nestjs/core';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { AppModule } from './app.module';

async function bootstrap() {
  let microserviceOptions: any = {
    url: process.env.MQTT_URL
  }
  if (process.env.MQTT_USERNAME && process.env.MQTT_PASSWORD) {
    microserviceOptions.username = process.env.MQTT_USERNAME;
    microserviceOptions.password = process.env.MQTT_PASSWORD;
  }
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.MQTT,
      options: microserviceOptions
    },
  );
  app.listen(() => console.log('Microservice is listening'));
}
bootstrap();
