import { Entity, Property, Enum, Unique } from '@mikro-orm/core';
import { BaseEntity } from './BaseEntity';

@Entity()
export class Sensor extends BaseEntity {

  @Property()
  name: string;

  @Unique()
  @Property()
  identifier: string;

  @Enum()
  type: SensorType

  constructor(name: string, identifier: string, type: SensorType) {
    super();
    this.name = name;
    this.identifier = identifier;
    this.type = type;
  }

}

export enum SensorType {
  RUUVITAG = 'ruuvitag',
  MQTT = 'mqtt'
};