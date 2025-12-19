import { Module } from '@nestjs/common';
import { WorkflowDefinitionsService } from './workflow-definitions.service';
import { WorkflowDefinitionsController } from './workflow-definitions.controller';

@Module({
  controllers: [WorkflowDefinitionsController],
  providers: [WorkflowDefinitionsService],
  exports: [WorkflowDefinitionsService],
})
export class WorkflowDefinitionsModule {}
