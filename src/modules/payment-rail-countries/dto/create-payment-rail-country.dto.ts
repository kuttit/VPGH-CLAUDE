import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsDateString } from 'class-validator';

export class CreatePaymentRailCountryDto {
  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  railId: string;

  @ApiProperty({
    description: 'Country ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  countryId: string;

  @ApiPropertyOptional({
    description: 'Is domestic payment supported',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isDomestic?: boolean;

  @ApiPropertyOptional({
    description: 'Is cross-border payment supported',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isCrossBorder?: boolean;

  @ApiPropertyOptional({
    description: 'Is the association active',
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
    description: 'Country-specific configuration',
    example: { local_clearing_code: 'USABA' },
  })
  @IsOptional()
  @IsObject()
  countrySpecificConfig?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {},
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
