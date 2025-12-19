import { Module } from '@nestjs/common';
import { WorkflowStepTransitionsService } from './workflow-step-transitions.service';
import { WorkflowStepTransitionsController } from './workflow-step-transitions.controller';

@Module({
  controllers: [WorkflowStepTransitionsController],
  providers: [WorkflowStepTransitionsService],
  exports: [WorkflowStepTransitionsService],
})
export class WorkflowStepTransitionsModule {}
