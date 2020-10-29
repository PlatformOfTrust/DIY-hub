import { Module } from '@nestjs/common';
import { RuuvitagModule } from './ruuvitag/ruuvitag.module';

@Module({
  imports: [
    RuuvitagModule
  ]
})
export class AppModule {}
