import { Controller, Logger } from '@nestjs/common';
import { MessagePattern, Payload } from '@nestjs/microservices';
import { Point } from '@influxdata/influxdb-client';
import { InfluxService } from 'src/influx/influx.service';
import { SensorService } from 'src/sensors/sensors.service';
import { Sensor, SensorType } from 'src/entities';

interface Reading {
  identifier: string,
  data: any
}

@Controller()
export class RuuvitagController {
  
  constructor(private influxService: InfluxService, private sensorService: SensorService) {}
  
  private readonly logger = new Logger(RuuvitagController.name);

  @MessagePattern(`${process.env.MQTT_TOPIC_PREFIX}/ruuvitag/found`)
  async handleRuuvitagFound(@Payload() data: any) {
    console.log("Tag found");
    const sensor = await this.sensorService.findSensorByIdentifier(data.identifier);
    console.log(sensor);
    if (!sensor) {
      const pendingSensor = new Sensor(data.identifier, data.identifier, SensorType.RUUVITAG);
      this.sensorService.addPendingSensor(pendingSensor);
    } 
  }

  @MessagePattern(`${process.env.MQTT_TOPIC_PREFIX}/ruuvitag/update`)
  async handleRuuvitagUpdate(@Payload() data: Reading) {
    const sensor = await this.sensorService.findSensorByIdentifier(data.identifier);
    if (!sensor) {
      this.logger.warn(`Received data from unknown ruuvitag ( ${data.identifier} )`);
    } else {
      const points: Point[] = [];
      const temperaturePoint = new Point("temperature");
      temperaturePoint.tag("sensorId", sensor.id.toString());
      temperaturePoint.floatField("value", data.data.temperature);
      points.push(temperaturePoint);

      const humidityPoint = new Point("humidity");
      humidityPoint.tag("sensorId", sensor.id.toString());
      humidityPoint.floatField("value", data.data.humidity);
      points.push(humidityPoint);

      const pressurePoint = new Point("pressure");
      pressurePoint.tag("sensorId", sensor.id.toString());
      pressurePoint.intField("value", data.data.pressure);
      points.push(pressurePoint);

      const accelerationPoint = new Point("acceleration");
      accelerationPoint.tag("sensorId", sensor.id.toString());
      accelerationPoint.intField("valueX", data.data.accelerationX);
      accelerationPoint.intField("valueY", data.data.accelerationY);
      accelerationPoint.intField("valueZ", data.data.accelerationZ);
      points.push(accelerationPoint);

      const batteryPoint = new Point("battery");
      batteryPoint.tag("sensorId", sensor.id.toString());
      batteryPoint.intField("value", data.data.battery);
      points.push(batteryPoint);
      
      const txPowerPoint = new Point("battery");
      txPowerPoint.tag("sensorId", sensor.id.toString());
      txPowerPoint.intField("value", data.data.txPower);
      points.push(txPowerPoint);

      const rssiPoint = new Point("rssi");
      rssiPoint.tag("sensorId", sensor.id.toString());
      rssiPoint.intField("value", data.data.rssi);
      points.push(rssiPoint);

      try {
        await this.influxService.insertDataPoints(points);
        this.logger.log(`Ruuvitag ( ${sensor.name} ) sent data`);
      } catch(e) {
        this.logger.error('Error storing data from ruuvitag', e);
      }
      
    }
  }
}