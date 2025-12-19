import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsObject, MaxLength, IsDateString } from 'class-validator';

export class CreateSystemConfigurationDto {
  @ApiProperty({ description: 'Configuration key', example: 'MAX_TRANSACTION_AMOUNT', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  configKey: string;

  @ApiProperty({ description: 'Configuration value', example: '1000000' })
  @IsString()
  configValue: string;

  @ApiPropertyOptional({ description: 'Configuration type', example: 'NUMBER', default: 'STRING', maxLength: 20 })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  configType?: string;

  @ApiPropertyOptional({ description: 'Category', example: 'LIMITS', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ description: 'Is sensitive value', default: false })
  @IsOptional()
  @IsBoolean()
  isSensitive?: boolean;

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

  @ApiPropertyOptional({ description: 'Created by', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  createdBy?: string;
}
