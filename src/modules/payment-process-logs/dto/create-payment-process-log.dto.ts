import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsInt, IsEnum, MaxLength } from 'class-validator';

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

export class CreatePaymentProcessLogDto {
  @ApiProperty({ description: 'Transaction ID', example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  transactionId: string;

  @ApiPropertyOptional({ description: 'Workflow ID' })
  @IsOptional()
  @IsUUID()
  workflowId?: string;

  @ApiPropertyOptional({ description: 'Step ID' })
  @IsOptional()
  @IsUUID()
  stepId?: string;

  @ApiProperty({ description: 'Event ID', example: 'EVT001', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  eventId: string;

  @ApiProperty({ description: 'Event sequence', example: 1 })
  @IsInt()
  eventSequence: number;

  @ApiProperty({ description: 'Event type', example: 'STEP_STARTED', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  eventType: string;

  @ApiProperty({ description: 'Execution status', enum: StepExecutionStatus })
  @IsEnum(StepExecutionStatus)
  executionStatus: StepExecutionStatus;

  @ApiPropertyOptional({ description: 'Previous status', enum: StepExecutionStatus })
  @IsOptional()
  @IsEnum(StepExecutionStatus)
  previousStatus?: StepExecutionStatus;

  @ApiPropertyOptional({ description: 'Step code', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  stepCode?: string;

  @ApiPropertyOptional({ description: 'Step name', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  stepName?: string;

  @ApiPropertyOptional({ description: 'Duration in milliseconds' })
  @IsOptional()
  @IsInt()
  durationMs?: number;

  @ApiPropertyOptional({ description: 'Input data' })
  @IsOptional()
  @IsObject()
  inputData?: any;

  @ApiPropertyOptional({ description: 'Output data' })
  @IsOptional()
  @IsObject()
  outputData?: any;

  @ApiPropertyOptional({ description: 'Is HITL triggered', default: false })
  @IsOptional()
  @IsBoolean()
  isHitlTriggered?: boolean;

  @ApiPropertyOptional({ description: 'HITL reason' })
  @IsOptional()
  @IsString()
  hitlReason?: string;

  @ApiPropertyOptional({ description: 'Message' })
  @IsOptional()
  @IsString()
  message?: string;

  @ApiPropertyOptional({ description: 'Details' })
  @IsOptional()
  @IsObject()
  details?: any;

  @ApiPropertyOptional({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
