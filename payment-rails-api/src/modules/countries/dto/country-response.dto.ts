import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CountryResponseDto {
  @ApiProperty({
    description: 'Country ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-3 country code',
    example: 'USA',
  })
  countryCode: string;

  @ApiProperty({
    description: 'ISO 3166-1 alpha-2 country code',
    example: 'US',
  })
  countryCodeAlpha2: string;

  @ApiProperty({
    description: 'Country name',
    example: 'United States',
  })
  countryName: string;

  @ApiPropertyOptional({
    description: 'ISO 3166-1 numeric code',
    example: '840',
  })
  numericCode?: string;

  @ApiProperty({
    description: 'Is country active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Region',
    example: 'Americas',
  })
  region?: string;

  @ApiPropertyOptional({
    description: 'Sub-region',
    example: 'Northern America',
  })
  subRegion?: string;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata?: any;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
