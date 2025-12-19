import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, Length, IsObject } from 'class-validator';

export class CreateCountryDto {
  @ApiProperty({
    description: 'ISO 3166-1 alpha-3 country code',
    example: 'USA',
    maxLength: 3,
  })
  @IsString()
  @Length(3, 3)
  countryCode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code',
    example: 'US',
    maxLength: 2,
  })
  @IsString()
  @Length(2, 2)
  countryCodeAlpha2: string;

  @ApiProperty({
    description: 'Country name',
    example: 'United States',
    maxLength: 100,
  })
  @IsString()
  countryName: string;

  @ApiPropertyOptional({
    description: 'ISO 3166-1 numeric code',
    example: '840',
    maxLength: 3,
  })
  @IsOptional()
  @IsString()
  @Length(3, 3)
  numericCode?: string;

  @ApiPropertyOptional({
    description: 'Is country active',
    example: true,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Region',
    example: 'Americas',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  region?: string;

  @ApiPropertyOptional({
    description: 'Sub-region',
    example: 'Northern America',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  subRegion?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: { timezone: 'UTC-5', calling_code: '+1' },
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
