import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkflowDefinitionResponseDto {
  @ApiProperty({
    description: 'Workflow Definition ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  railId: string;

  @ApiPropertyOptional({
    description: 'Payment Product ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  productId?: string;

  @ApiProperty({
    description: 'Workflow code',
    example: 'OUTBOUND_PAYMENT',
  })
  workflowCode: string;

  @ApiProperty({
    description: 'Workflow name',
    example: 'Outbound Payment Workflow',
  })
  workflowName: string;

  @ApiPropertyOptional({
    description: 'Workflow description',
  })
  workflowDescription?: string;

  @ApiProperty({
    description: 'Workflow version',
    example: '1.0',
  })
  workflowVersion: string;

  @ApiProperty({
    description: 'Payment direction',
    example: 'OUTBOUND',
  })
  direction: string;

  @ApiProperty({
    description: 'Is default workflow',
    example: false,
  })
  isDefault: boolean;

  @ApiProperty({
    description: 'Is workflow active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Workflow configuration',
  })
  workflowConfig?: any;

  @ApiPropertyOptional({
    description: 'Retry policy configuration',
  })
  retryPolicy?: any;

  @ApiPropertyOptional({
    description: 'Timeout configuration',
  })
  timeoutConfig?: any;

  @ApiPropertyOptional({
    description: 'HITL configuration',
  })
  hitlConfig?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata?: any;

  @ApiPropertyOptional({
    description: 'Created by user',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Updated by user',
  })
  updatedBy?: string;

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
