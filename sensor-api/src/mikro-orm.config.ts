import { Logger } from '@nestjs/common';
import { Options } from '@mikro-orm/core';
import { Sensor, BaseEntity } from './entities';
import { migrationsList } from "./migrations";

const logger = new Logger('MikroORM');
const config = {
  entities: [Sensor, BaseEntity],
  dbName: process.env.DB_FILE || 'db.sqlite3',
  type: 'sqlite',
  debug: process.env.LOG_SQL_STATEMENTS ? process.env.LOG_SQL_STATEMENTS == "true" : false,
  logger: logger.log.bind(logger),
  migrations: {
    migrationsList: migrationsList 
  }
} as Options;

export default config;