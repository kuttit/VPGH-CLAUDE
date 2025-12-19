import { PartialType } from '@nestjs/swagger';
import { CreateWorkflowStepTransitionDto } from './create-workflow-step-transition.dto';

export class UpdateWorkflowStepTransitionDto extends PartialType(CreateWorkflowStepTransitionDto) {}
