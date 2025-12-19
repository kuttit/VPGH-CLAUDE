import { Module } from '@nestjs/common';
import { SystemConfigurationsService } from './system-configurations.service';
import { SystemConfigurationsController } from './system-configurations.controller';

@Module({
  controllers: [SystemConfigurationsController],
  providers: [SystemConfigurationsService],
  exports: [SystemConfigurationsService],
})
export class SystemConfigurationsModule {}
