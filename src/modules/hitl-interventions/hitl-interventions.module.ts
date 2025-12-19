import { Module } from '@nestjs/common';
import { HitlInterventionsService } from './hitl-interventions.service';
import { HitlInterventionsController } from './hitl-interventions.controller';

@Module({
  controllers: [HitlInterventionsController],
  providers: [HitlInterventionsService],
  exports: [HitlInterventionsService],
})
export class HitlInterventionsModule {}
