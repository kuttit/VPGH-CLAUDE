import { Module } from '@nestjs/common';
import { HitlAuditTrailsService } from './hitl-audit-trails.service';
import { HitlAuditTrailsController } from './hitl-audit-trails.controller';

@Module({
  controllers: [HitlAuditTrailsController],
  providers: [HitlAuditTrailsService],
  exports: [HitlAuditTrailsService],
})
export class HitlAuditTrailsModule {}
