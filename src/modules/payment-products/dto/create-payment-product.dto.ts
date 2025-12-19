import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsNumber, IsObject, MaxLength, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreatePaymentProductDto {
  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  railId: string;

  @ApiProperty({
    description: 'Product code',
    example: 'INST_PAY',
    maxLength: 50,
  })
  @IsString()
  @MaxLength(50)
  productCode: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Instant Payment',
    maxLength: 100,
  })
  @IsString()
  @MaxLength(100)
  productName: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Real-time instant payment service',
  })
  @IsOptional()
  @IsString()
  productDescription?: string;

  @ApiPropertyOptional({
    description: 'Product type',
    example: 'INSTANT',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  productType?: string;

  @ApiPropertyOptional({
    description: 'Is instant payment',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isInstant?: boolean;

  @ApiPropertyOptional({
    description: 'Requires response',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresResponse?: boolean;

  @ApiPropertyOptional({
    description: 'Maximum transaction amount',
    example: 100000.00,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Minimum transaction amount',
    example: 0.01,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  @Min(0)
  @Type(() => Number)
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Fee structure configuration',
    example: { flat_fee: 1.50, percentage: 0.1 },
  })
  @IsOptional()
  @IsObject()
  feeStructure?: any;

  @ApiPropertyOptional({
    description: 'Product configuration',
    example: { timeout_seconds: 30 },
  })
  @IsOptional()
  @IsObject()
  productConfig?: any;

  @ApiPropertyOptional({
    description: 'Validation rules configuration',
    example: { require_bic: true },
  })
  @IsOptional()
  @IsObject()
  validationRules?: any;

  @ApiPropertyOptional({
    description: 'Is product active',
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
