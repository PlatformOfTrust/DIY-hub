import { Injectable, HttpException, HttpStatus } from "@nestjs/common";
import { InjectRepository } from "@mikro-orm/nestjs";
import { Sensor } from "src/entities";
import { EntityRepository, wrap } from "@mikro-orm/core";

@Injectable()
export class SensorService {

  private pendingSensors: Sensor[] = [];

  constructor(@InjectRepository(Sensor) private readonly sensorRepository: EntityRepository<Sensor>) {}

  addPendingSensor(pendingSensor: Sensor) {
    console.log("Adding sernsor", pendingSensor);
    this.pendingSensors.push(pendingSensor);
  }

  listPendingSensors() {
    return this.pendingSensors;
  }

  listSensors(): Promise<Sensor[]> {
    return this.sensorRepository.findAll();
  }

  async findSensorByIdOrFail(id: number): Promise<Sensor> {
    const sensor = await this.sensorRepository.findOne(id);
    if (!sensor) {
      throw new HttpException(`Cannot find sensor with id: ${id}`, HttpStatus.NOT_FOUND);
    }
    return sensor;
  }

  async findSensorByIdentifier(identifier: string): Promise<Sensor | undefined> {
    return await this.sensorRepository.findOne({
      identifier: identifier
    });
  }

  async createSensor(data: any): Promise<Sensor> {
    this.pendingSensors = this.pendingSensors.filter(pendingSensor => pendingSensor.identifier !== data.identifier);
    const sensor = new Sensor(data.name, data.identifier, data.type);
    wrap(sensor).assign(data);
    await this.sensorRepository.persistAndFlush(sensor);
    return sensor
  }

  async updateSensorOrFail(id: number, data: any): Promise<Sensor> {
    const sensor = await this.findSensorByIdOrFail(id);
    wrap(sensor).assign(data);
    await this.sensorRepository.persistAndFlush(sensor);
    return sensor
  }

  async deleteSensorOrFail(id: number): Promise<void> {
    const sensor = await this.findSensorByIdOrFail(id);
    await this.sensorRepository.removeAndFlush(sensor);
  }
}