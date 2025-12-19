import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsInt, IsNumber, MaxLength, Min, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateRoutingRuleDto {
  @ApiProperty({
    description: 'Rule code',
    example: 'ROUTE_HIGH_VALUE',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  ruleCode: string;

  @ApiProperty({
    description: 'Rule name',
    example: 'High Value Transaction Routing',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  ruleName: string;

  @ApiPropertyOptional({
    description: 'Rule description',
    example: 'Routes high-value transactions to SWIFT',
  })
  @IsOptional()
  @IsString()
  ruleDescription?: string;

  @ApiPropertyOptional({
    description: 'Rule priority (lower is higher priority)',
    example: 100,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  rulePriority?: number;

  @ApiPropertyOptional({
    description: 'Condition: Source country ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  conditionCountryFrom?: string;

  @ApiPropertyOptional({
    description: 'Condition: Destination country ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  conditionCountryTo?: string;

  @ApiPropertyOptional({
    description: 'Condition: Currency ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  @IsOptional()
  @IsUUID()
  conditionCurrency?: string;

  @ApiPropertyOptional({
    description: 'Condition: Minimum amount',
    example: 10000.00,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  conditionAmountMin?: number;

  @ApiPropertyOptional({
    description: 'Condition: Maximum amount',
    example: 1000000.00,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  conditionAmountMax?: number;

  @ApiPropertyOptional({
    description: 'Additional condition expression (JSON)',
    example: { payment_type: 'INSTANT' },
  })
  @IsOptional()
  @IsObject()
  conditionExpression?: any;

  @ApiProperty({
    description: 'Target Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440003',
  })
  @IsUUID()
  targetRailId: string;

  @ApiPropertyOptional({
    description: 'Target Payment Product ID',
    example: '550e8400-e29b-41d4-a716-446655440004',
  })
  @IsOptional()
  @IsUUID()
  targetProductId?: string;

  @ApiPropertyOptional({
    description: 'Fallback Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440005',
  })
  @IsOptional()
  @IsUUID()
  fallbackRailId?: string;

  @ApiPropertyOptional({
    description: 'Is rule active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Effective from date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({
    description: 'Effective to date',
    example: '2025-12-31',
  })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

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
