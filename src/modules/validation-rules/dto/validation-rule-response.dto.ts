import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ValidationRuleResponseDto {
  @ApiProperty({
    description: 'Validation Rule ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiPropertyOptional({
    description: 'Payment Rail ID',
  })
  railId?: string;

  @ApiPropertyOptional({
    description: 'Payment Product ID',
  })
  productId?: string;

  @ApiProperty({
    description: 'Rule code',
    example: 'AMOUNT_LIMIT',
  })
  ruleCode: string;

  @ApiProperty({
    description: 'Rule name',
    example: 'Amount Limit Validation',
  })
  ruleName: string;

  @ApiPropertyOptional({
    description: 'Rule description',
  })
  ruleDescription?: string;

  @ApiPropertyOptional({
    description: 'Rule category',
  })
  ruleCategory?: string;

  @ApiProperty({
    description: 'Rule priority',
    example: 100,
  })
  rulePriority: number;

  @ApiProperty({
    description: 'Rule expression',
  })
  ruleExpression: any;

  @ApiPropertyOptional({
    description: 'Error code',
  })
  errorCode?: string;

  @ApiPropertyOptional({
    description: 'Error message',
  })
  errorMessage?: string;

  @ApiProperty({
    description: 'Is blocking rule',
    example: true,
  })
  isBlocking: boolean;

  @ApiProperty({
    description: 'Is rule active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Effective from date',
  })
  effectiveFrom?: Date;

  @ApiPropertyOptional({
    description: 'Effective to date',
  })
  effectiveTo?: Date;

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
