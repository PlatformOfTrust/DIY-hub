import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { Sensor, BaseEntity } from './entities';

const logger = new Logger('MikroORM');
const config = {
  entities: [Sensor, BaseEntity],
  dbName: 'sensor-api.sqlite3',
  type: 'sqlite',
  debug: process.env.LOG_SQL_STATEMENTS ? process.env.LOG_SQL_STATEMENTS == "true" : false,
  logger: logger.log.bind(logger),
} as Options;

export default config;