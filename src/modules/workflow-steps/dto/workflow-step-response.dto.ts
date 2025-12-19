import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkflowStepResponseDto {
  @ApiProperty({
    description: 'Workflow Step ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Workflow Definition ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  workflowId: string;

  @ApiProperty({
    description: 'Step sequence number',
    example: 1,
  })
  stepSequence: number;

  @ApiProperty({
    description: 'Step code',
    example: 'VALIDATE_INPUT',
  })
  stepCode: string;

  @ApiProperty({
    description: 'Step name',
    example: 'Validate Input Data',
  })
  stepName: string;

  @ApiPropertyOptional({
    description: 'Step description',
  })
  stepDescription?: string;

  @ApiProperty({
    description: 'Step type',
    example: 'VALIDATION',
  })
  stepType: string;

  @ApiProperty({
    description: 'Is step mandatory',
    example: true,
  })
  isMandatory: boolean;

  @ApiProperty({
    description: 'Is step async',
    example: false,
  })
  isAsync: boolean;

  @ApiProperty({
    description: 'Is HITL checkpoint',
    example: false,
  })
  isHitlCheckpoint: boolean;

  @ApiPropertyOptional({
    description: 'Condition expression',
  })
  conditionExpression?: string;

  @ApiProperty({
    description: 'Skip step if condition is true',
    example: false,
  })
  skipOnCondition: boolean;

  @ApiProperty({
    description: 'Action on error',
    example: 'FAIL',
  })
  onErrorAction: string;

  @ApiProperty({
    description: 'Maximum retries',
    example: 3,
  })
  maxRetries: number;

  @ApiProperty({
    description: 'Retry delay in seconds',
    example: 60,
  })
  retryDelaySeconds: number;

  @ApiPropertyOptional({
    description: 'Step configuration',
  })
  stepConfig?: any;

  @ApiPropertyOptional({
    description: 'Input mapping',
  })
  inputMapping?: any;

  @ApiPropertyOptional({
    description: 'Output mapping',
  })
  outputMapping?: any;

  @ApiPropertyOptional({
    description: 'Validation schema',
  })
  validationSchema?: any;

  @ApiPropertyOptional({
    description: 'HITL triggers',
  })
  hitlTriggers?: any;

  @ApiProperty({
    description: 'Is step active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata?: any;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
