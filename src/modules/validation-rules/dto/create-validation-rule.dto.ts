import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsInt, MaxLength, Min, IsDateString } from 'class-validator';

export class CreateValidationRuleDto {
  @ApiPropertyOptional({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  railId?: string;

  @ApiPropertyOptional({
    description: 'Payment Product ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({
    description: 'Rule code',
    example: 'AMOUNT_LIMIT',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  ruleCode: string;

  @ApiProperty({
    description: 'Rule name',
    example: 'Amount Limit Validation',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  ruleName: string;

  @ApiPropertyOptional({
    description: 'Rule description',
    example: 'Validates transaction amount is within limits',
  })
  @IsOptional()
  @IsString()
  ruleDescription?: string;

  @ApiPropertyOptional({
    description: 'Rule category',
    example: 'AMOUNT',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  ruleCategory?: string;

  @ApiPropertyOptional({
    description: 'Rule priority (lower is higher priority)',
    example: 100,
    default: 100,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  rulePriority?: number;

  @ApiProperty({
    description: 'Rule expression (JSON-based expression)',
    example: { field: 'amount', operator: 'lte', value: 100000 },
  })
  @IsObject()
  ruleExpression: any;

  @ApiPropertyOptional({
    description: 'Error code on validation failure',
    example: 'ERR_AMOUNT_EXCEEDED',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  errorCode?: string;

  @ApiPropertyOptional({
    description: 'Error message on validation failure',
    example: 'Transaction amount exceeds the maximum limit',
  })
  @IsOptional()
  @IsString()
  errorMessage?: string;

  @ApiPropertyOptional({
    description: 'Is blocking rule (stops processing on failure)',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isBlocking?: boolean;

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
