import { Module } from '@nestjs/common';
import { AuditTrailsService } from './audit-trails.service';
import { AuditTrailsController } from './audit-trails.controller';

@Module({
  controllers: [AuditTrailsController],
  providers: [AuditTrailsService],
  exports: [AuditTrailsService],
})
export class AuditTrailsModule {}
