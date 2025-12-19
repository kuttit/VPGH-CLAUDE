import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsInt, IsBoolean, IsOptional, Length, Min, Max, IsObject } from 'class-validator';

export class CreateCurrencyDto {
  @ApiProperty({
    description: 'ISO 4217 currency code',
    example: 'USD',
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  currencyCode: string;

  @ApiProperty({
    description: 'Currency name',
    example: 'US Dollar',
    maxLength: 100,
  })
  @IsString()
  currencyName: string;

  @ApiPropertyOptional({
    description: 'ISO 4217 numeric code',
    example: '840',
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  numericCode?: string;

  @ApiPropertyOptional({
    description: 'Number of minor units (decimal places)',
    example: 2,
    default: 2,
    minimum: 0,
    maximum: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(4)
  minorUnits?: number;

  @ApiPropertyOptional({
    description: 'Currency symbol',
    example: '$',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  symbol?: string;

  @ApiPropertyOptional({
    description: 'Is currency active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { country: 'USA', alternate_symbols: ['US$'] },
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
