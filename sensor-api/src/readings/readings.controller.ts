import { Controller, Logger } from '@nestjs/common';
import { Ctx, MessagePattern, MqttContext, Payload } from '@nestjs/microservices';
import { Point } from '@influxdata/influxdb-client';
import { InfluxService } from 'src/influx/influx.service';
import { SensorService } from 'src/sensors/sensors.service';

interface Reading {
  unit: string,
  value: number
}

@Controller()
export class ReadingsController {
  
  constructor(private influxService: InfluxService, private sensorService: SensorService) {}
  
  private readonly logger = new Logger(ReadingsController.name);

  @MessagePattern(`${process.env.MQTT_TOPIC_PREFIX}/readings/+`)
  async getTemperature(@Payload() data: Reading, @Ctx() context: MqttContext) {
    const topic = context.getTopic();
    const sensorId = topic.substring(topic.lastIndexOf("/") + 1);
    const sensor = await this.sensorService.findSensorByIdentifier(sensorId);
    if (!sensor) {
      this.logger.warn(`Received data from unknown sensor ( ${sensorId} )`);
    } else {
      const point = new Point(data.unit);
      point.tag("sensorId", sensor.id.toString());
      point.floatField("value", data.value);
      try {
        await this.influxService.insertDataPoints([point]);
        this.logger.log(`Sensor ( ${sensor.name} ) sent data`);
      } catch(e) {
        this.logger.error('Error storing data from sensor', e);
      }
    }

  }
}