import { Module } from '@nestjs/common';
import { WorkflowStepsService } from './workflow-steps.service';
import { WorkflowStepsController } from './workflow-steps.controller';

@Module({
  controllers: [WorkflowStepsController],
  providers: [WorkflowStepsService],
  exports: [WorkflowStepsService],
})
export class WorkflowStepsModule {}
