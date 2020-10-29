import { Module } from "@nestjs/common";
import { InfluxModule } from "src/influx/influx.module";
import { SensorsModule } from "src/sensors/sensors.module";
import { ReadingsController } from "./readings.controller";

@Module({
  imports: [
    SensorsModule,
    InfluxModule
  ],
  controllers: [ReadingsController],
})
export class ReadingsModule {}