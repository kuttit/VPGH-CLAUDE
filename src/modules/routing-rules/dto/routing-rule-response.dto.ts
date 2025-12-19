import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RoutingRuleResponseDto {
  @ApiProperty({
    description: 'Routing Rule ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Rule code',
    example: 'ROUTE_HIGH_VALUE',
  })
  ruleCode: string;

  @ApiProperty({
    description: 'Rule name',
    example: 'High Value Transaction Routing',
  })
  ruleName: string;

  @ApiPropertyOptional({
    description: 'Rule description',
  })
  ruleDescription?: string;

  @ApiProperty({
    description: 'Rule priority',
    example: 100,
  })
  rulePriority: number;

  @ApiPropertyOptional({
    description: 'Condition: Source country ID',
  })
  conditionCountryFrom?: string;

  @ApiPropertyOptional({
    description: 'Condition: Destination country ID',
  })
  conditionCountryTo?: string;

  @ApiPropertyOptional({
    description: 'Condition: Currency ID',
  })
  conditionCurrency?: string;

  @ApiPropertyOptional({
    description: 'Condition: Minimum amount',
  })
  conditionAmountMin?: number;

  @ApiPropertyOptional({
    description: 'Condition: Maximum amount',
  })
  conditionAmountMax?: number;

  @ApiPropertyOptional({
    description: 'Additional condition expression',
  })
  conditionExpression?: any;

  @ApiProperty({
    description: 'Target Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  targetRailId: string;

  @ApiPropertyOptional({
    description: 'Target Payment Product ID',
  })
  targetProductId?: string;

  @ApiPropertyOptional({
    description: 'Fallback Payment Rail ID',
  })
  fallbackRailId?: string;

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
