import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsInt, MaxLength, Min, IsEnum } from 'class-validator';

enum WorkflowStepType {
  VALIDATION = 'VALIDATION',
  TRANSFORMATION = 'TRANSFORMATION',
  ENRICHMENT = 'ENRICHMENT',
  ROUTING = 'ROUTING',
  COMPLIANCE_CHECK = 'COMPLIANCE_CHECK',
  FRAUD_CHECK = 'FRAUD_CHECK',
  AUTHORIZATION = 'AUTHORIZATION',
  SUBMISSION = 'SUBMISSION',
  ACKNOWLEDGMENT = 'ACKNOWLEDGMENT',
  SETTLEMENT = 'SETTLEMENT',
  NOTIFICATION = 'NOTIFICATION',
  RECONCILIATION = 'RECONCILIATION',
  HITL_CHECKPOINT = 'HITL_CHECKPOINT',
}

export class CreateWorkflowStepDto {
  @ApiProperty({
    description: 'Workflow Definition ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  workflowId: string;

  @ApiProperty({
    description: 'Step sequence number',
    example: 1,
    minimum: 1,
  })
  @IsInt()
  @Min(1)
  stepSequence: number;

  @ApiProperty({
    description: 'Step code',
    example: 'VALIDATE_INPUT',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  stepCode: string;

  @ApiProperty({
    description: 'Step name',
    example: 'Validate Input Data',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  stepName: string;

  @ApiPropertyOptional({
    description: 'Step description',
    example: 'Validates the input payment data',
  })
  @IsOptional()
  @IsString()
  stepDescription?: string;

  @ApiProperty({
    description: 'Step type',
    enum: WorkflowStepType,
    example: 'VALIDATION',
  })
  @IsEnum(WorkflowStepType)
  stepType: WorkflowStepType;

  @ApiPropertyOptional({
    description: 'Is step mandatory',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isMandatory?: boolean;

  @ApiPropertyOptional({
    description: 'Is step async',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isAsync?: boolean;

  @ApiPropertyOptional({
    description: 'Is HITL checkpoint',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isHitlCheckpoint?: boolean;

  @ApiPropertyOptional({
    description: 'Condition expression for step execution',
    example: 'amount > 10000',
  })
  @IsOptional()
  @IsString()
  conditionExpression?: string;

  @ApiPropertyOptional({
    description: 'Skip step if condition is true',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  skipOnCondition?: boolean;

  @ApiPropertyOptional({
    description: 'Action on error',
    example: 'FAIL',
    default: 'FAIL',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  onErrorAction?: string;

  @ApiPropertyOptional({
    description: 'Maximum retries',
    example: 3,
    default: 3,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  maxRetries?: number;

  @ApiPropertyOptional({
    description: 'Retry delay in seconds',
    example: 60,
    default: 60,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  retryDelaySeconds?: number;

  @ApiPropertyOptional({
    description: 'Step configuration',
    example: {},
  })
  @IsOptional()
  @IsObject()
  stepConfig?: any;

  @ApiPropertyOptional({
    description: 'Input mapping',
    example: {},
  })
  @IsOptional()
  @IsObject()
  inputMapping?: any;

  @ApiPropertyOptional({
    description: 'Output mapping',
    example: {},
  })
  @IsOptional()
  @IsObject()
  outputMapping?: any;

  @ApiPropertyOptional({
    description: 'Validation schema',
    example: {},
  })
  @IsOptional()
  @IsObject()
  validationSchema?: any;

  @ApiPropertyOptional({
    description: 'HITL triggers',
    example: [],
  })
  @IsOptional()
  @IsObject()
  hitlTriggers?: any;

  @ApiPropertyOptional({
    description: 'Is step active',
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
