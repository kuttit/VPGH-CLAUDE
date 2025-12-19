import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, MaxLength } from 'class-validator';

export class CreatePaymentRailCurrencyDto {
  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  railId: string;

  @ApiProperty({
    description: 'Currency ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsUUID()
  currencyId: string;

  @ApiPropertyOptional({
    description: 'Is this the primary currency for the rail',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isPrimary?: boolean;

  @ApiPropertyOptional({
    description: 'Is the association active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Exchange rate source',
    example: 'REUTERS',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  exchangeRateSource?: string;

  @ApiPropertyOptional({
    description: 'Currency-specific configuration',
    example: { decimal_places: 2 },
  })
  @IsOptional()
  @IsObject()
  currencySpecificConfig?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {},
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
