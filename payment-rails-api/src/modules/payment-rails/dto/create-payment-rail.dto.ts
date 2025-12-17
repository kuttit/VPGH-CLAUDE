import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsNumber, IsObject } from 'class-validator';

export class CreatePaymentRailDto {
  @ApiProperty({
    description: 'Unique rail code',
    example: 'FEDNOW',
    maxLength: 50,
  })
  @IsString()
  railCode: string;

  @ApiProperty({
    description: 'Rail name',
    example: 'FedNow Service',
    maxLength: 100,
  })
  @IsString()
  railName: string;

  @ApiPropertyOptional({
    description: 'Rail description',
    example: 'Federal Reserve Instant Payment Service',
  })
  @IsOptional()
  @IsString()
  railDescription?: string;

  @ApiProperty({
    description: 'Rail type',
    example: 'REAL_TIME',
    maxLength: 50,
  })
  @IsString()
  railType: string;

  @ApiPropertyOptional({
    description: 'Operator name',
    example: 'Federal Reserve',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  operatorName?: string;

  @ApiPropertyOptional({
    description: 'Operator country ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  operatorCountryId?: string;

  @ApiPropertyOptional({
    description: 'Is real-time processing',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isRealTime?: boolean;

  @ApiPropertyOptional({
    description: 'Is available 24x7',
    example: true,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  is24x7?: boolean;

  @ApiPropertyOptional({
    description: 'Settlement type',
    example: 'INSTANT',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  settlementType?: string;

  @ApiPropertyOptional({
    description: 'Maximum transaction amount',
    example: 1000000.00,
  })
  @IsOptional()
  @IsNumber()
  maxAmount?: number;

  @ApiPropertyOptional({
    description: 'Minimum transaction amount',
    example: 0.01,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  minAmount?: number;

  @ApiPropertyOptional({
    description: 'Cutoff time',
    example: '17:00:00',
  })
  @IsOptional()
  @IsString()
  cutoffTime?: string;

  @ApiPropertyOptional({
    description: 'Timezone',
    example: 'America/New_York',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Message format',
    example: 'ISO20022',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  messageFormat?: string;

  @ApiPropertyOptional({
    description: 'Version',
    example: '1.0',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  version?: string;

  @ApiPropertyOptional({
    description: 'Is rail active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Rail configuration',
    example: { max_concurrent_transactions: 1000 },
  })
  @IsOptional()
  @IsObject()
  railConfig?: any;

  @ApiPropertyOptional({
    description: 'API configuration',
    example: { base_url: 'https://api.fednow.gov', version: 'v1' },
  })
  @IsOptional()
  @IsObject()
  apiConfig?: any;

  @ApiPropertyOptional({
    description: 'Security configuration',
    example: { encryption: 'AES256', signing_algorithm: 'RSA' },
  })
  @IsOptional()
  @IsObject()
  securityConfig?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiPropertyOptional({
    description: 'Created by user',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
