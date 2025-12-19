import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, MaxLength, IsEnum } from 'class-validator';

enum PaymentDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  INTERNAL = 'INTERNAL',
}

export class CreateWorkflowDefinitionDto {
  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  railId: string;

  @ApiPropertyOptional({
    description: 'Payment Product ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({
    description: 'Workflow code',
    example: 'OUTBOUND_PAYMENT',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  workflowCode: string;

  @ApiProperty({
    description: 'Workflow name',
    example: 'Outbound Payment Workflow',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  workflowName: string;

  @ApiPropertyOptional({
    description: 'Workflow description',
    example: 'Standard outbound payment processing workflow',
  })
  @IsOptional()
  @IsString()
  workflowDescription?: string;

  @ApiPropertyOptional({
    description: 'Workflow version',
    example: '1.0',
    default: '1.0',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  workflowVersion?: string;

  @ApiProperty({
    description: 'Payment direction',
    enum: PaymentDirection,
    example: 'OUTBOUND',
  })
  @IsEnum(PaymentDirection)
  direction: PaymentDirection;

  @ApiPropertyOptional({
    description: 'Is default workflow',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiPropertyOptional({
    description: 'Is workflow active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Workflow configuration',
    example: {},
  })
  @IsOptional()
  @IsObject()
  workflowConfig?: any;

  @ApiPropertyOptional({
    description: 'Retry policy configuration',
    example: { max_retries: 3, retry_delay_seconds: 60 },
  })
  @IsOptional()
  @IsObject()
  retryPolicy?: any;

  @ApiPropertyOptional({
    description: 'Timeout configuration',
    example: { step_timeout_minutes: 5, workflow_timeout_minutes: 60 },
  })
  @IsOptional()
  @IsObject()
  timeoutConfig?: any;

  @ApiPropertyOptional({
    description: 'HITL configuration',
    example: { enabled: true, require_approval_for: ['SUSPICIOUS'] },
  })
  @IsOptional()
  @IsObject()
  hitlConfig?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {},
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiPropertyOptional({
    description: 'Created by user',
    example: 'admin',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  createdBy?: string;
}
