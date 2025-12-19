import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsNumber, MaxLength, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateFeeConfigurationDto {
  @ApiProperty({ description: 'Payment Rail ID' })
  @IsUUID()
  railId: string;

  @ApiPropertyOptional({ description: 'Payment Product ID' })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiProperty({ description: 'Fee code', example: 'TRANSFER_FEE', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  feeCode: string;

  @ApiProperty({ description: 'Fee name', example: 'Transfer Fee', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  feeName: string;

  @ApiProperty({ description: 'Fee type (FIXED, PERCENTAGE, TIERED)', example: 'FIXED', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  feeType: string;

  @ApiPropertyOptional({ description: 'Fixed fee amount', example: 5.00 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  feeAmount?: number;

  @ApiPropertyOptional({ description: 'Fee percentage', example: 0.001 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  feePercentage?: number;

  @ApiPropertyOptional({ description: 'Minimum fee', example: 1.00 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minFee?: number;

  @ApiPropertyOptional({ description: 'Maximum fee', example: 100.00 })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxFee?: number;

  @ApiPropertyOptional({ description: 'Currency ID' })
  @IsOptional()
  @IsUUID()
  currencyId?: string;

  @ApiPropertyOptional({ description: 'Amount range from' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amountFrom?: number;

  @ApiPropertyOptional({ description: 'Amount range to' })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amountTo?: number;

  @ApiPropertyOptional({ description: 'Tier configuration for tiered fees' })
  @IsOptional()
  @IsObject()
  tierConfig?: any;

  @ApiPropertyOptional({ description: 'Is active', default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({ description: 'Effective from' })
  @IsOptional()
  @IsDateString()
  effectiveFrom?: string;

  @ApiPropertyOptional({ description: 'Effective to' })
  @IsOptional()
  @IsDateString()
  effectiveTo?: string;

  @ApiPropertyOptional({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
