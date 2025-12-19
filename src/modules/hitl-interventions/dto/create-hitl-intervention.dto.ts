import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsInt, IsEnum, MaxLength, Min, IsDateString } from 'class-validator';

enum HitlContext {
  SUCCESS = 'SUCCESS',
  FAILURE = 'FAILURE',
  SUSPICIOUS = 'SUSPICIOUS',
  ERROR = 'ERROR',
  TIMEOUT = 'TIMEOUT',
  COMPLIANCE_REVIEW = 'COMPLIANCE_REVIEW',
  AMOUNT_THRESHOLD = 'AMOUNT_THRESHOLD',
  FRAUD_ALERT = 'FRAUD_ALERT',
}

export class CreateHitlInterventionDto {
  @ApiProperty({ description: 'Transaction ID' })
  @IsUUID()
  transactionId: string;

  @ApiPropertyOptional({ description: 'Process Log ID' })
  @IsOptional()
  @IsUUID()
  processLogId?: string;

  @ApiPropertyOptional({ description: 'Error Log ID' })
  @IsOptional()
  @IsUUID()
  errorLogId?: string;

  @ApiPropertyOptional({ description: 'Workflow ID' })
  @IsOptional()
  @IsUUID()
  workflowId?: string;

  @ApiPropertyOptional({ description: 'Step ID' })
  @IsOptional()
  @IsUUID()
  stepId?: string;

  @ApiPropertyOptional({ description: 'Queue name', default: 'DEFAULT', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  queueName?: string;

  @ApiPropertyOptional({ description: 'Priority (1-10)', default: 5 })
  @IsOptional()
  @IsInt()
  @Min(1)
  priority?: number;

  @ApiProperty({ description: 'Intervention context', enum: HitlContext })
  @IsEnum(HitlContext)
  interventionContext: HitlContext;

  @ApiProperty({ description: 'Trigger reason' })
  @IsString()
  triggerReason: string;

  @ApiPropertyOptional({ description: 'Assigned to user', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Due at datetime' })
  @IsOptional()
  @IsDateString()
  dueAt?: string;

  @ApiPropertyOptional({ description: 'Review data' })
  @IsOptional()
  @IsObject()
  reviewData?: any;

  @ApiPropertyOptional({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
