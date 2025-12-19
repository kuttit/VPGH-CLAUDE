import { Module } from '@nestjs/common';
import { FeeConfigurationsService } from './fee-configurations.service';
import { FeeConfigurationsController } from './fee-configurations.controller';

@Module({
  controllers: [FeeConfigurationsController],
  providers: [FeeConfigurationsService],
  exports: [FeeConfigurationsService],
})
export class FeeConfigurationsModule {}
