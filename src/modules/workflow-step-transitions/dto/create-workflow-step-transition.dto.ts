import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsInt, Min, IsEnum } from 'class-validator';

enum StepExecutionStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  ERROR = 'ERROR',
  SUSPICIOUS = 'SUSPICIOUS',
  SKIPPED = 'SKIPPED',
  TIMEOUT = 'TIMEOUT',
  WAITING_HITL = 'WAITING_HITL',
  HITL_APPROVED = 'HITL_APPROVED',
  HITL_REJECTED = 'HITL_REJECTED',
  RETRYING = 'RETRYING',
}

export class CreateWorkflowStepTransitionDto {
  @ApiProperty({
    description: 'Workflow Definition ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  workflowId: string;

  @ApiPropertyOptional({
    description: 'From Step ID (null for start)',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  fromStepId?: string;

  @ApiPropertyOptional({
    description: 'To Step ID (null for end)',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsOptional()
  @IsUUID()
  toStepId?: string;

  @ApiProperty({
    description: 'Transition trigger status',
    enum: StepExecutionStatus,
    example: 'SUCCESS',
  })
  @IsEnum(StepExecutionStatus)
  transitionTrigger: StepExecutionStatus;

  @ApiPropertyOptional({
    description: 'Condition expression for transition',
    example: 'result.approved == true',
  })
  @IsOptional()
  @IsString()
  conditionExpression?: string;

  @ApiPropertyOptional({
    description: 'Priority (lower is higher priority)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  priority?: number;

  @ApiPropertyOptional({
    description: 'Is transition active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {},
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
