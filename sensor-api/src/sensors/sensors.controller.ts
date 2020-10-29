import { Controller, Get, Param, ParseIntPipe, Delete, Put, Body, Post, Query } from '@nestjs/common';
import { SensorService } from './sensors.service';

@Controller('sensors')
export class SensorsController {

  constructor(private sensorService: SensorService) {}

  @Get()
  async list(@Query("pending") pending: boolean) {
    if (pending) {
      console.log("Listing pending sensors");
      return this.sensorService.listPendingSensors();
    }
    return await this.sensorService.listSensors();
  }

  @Post()
  async create(@Body() body: any) {
    return await this.sensorService.createSensor(body);
  }

  @Get(':id')
  async find(@Param('id', ParseIntPipe) id: number) {
    return await this.sensorService.findSensorByIdOrFail(id);
  }

  @Put(':id')
  async update(@Param('id', ParseIntPipe) id: number, @Body() body: any) {
    return await this.sensorService.updateSensorOrFail(id, body);
  }

  @Delete(':id')
  async delete(@Param('id', ParseIntPipe) id: number) {
    return await this.sensorService.deleteSensorOrFail(id);
  }


}