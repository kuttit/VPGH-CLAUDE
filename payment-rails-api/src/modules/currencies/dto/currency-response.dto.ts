import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CurrencyResponseDto {
  @ApiProperty({
    description: 'Currency ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'ISO 4217 currency code',
    example: 'USD',
  })
  currencyCode: string;

  @ApiProperty({
    description: 'Currency name',
    example: 'US Dollar',
  })
  currencyName: string;

  @ApiPropertyOptional({
    description: 'ISO 4217 numeric code',
    example: '840',
  })
  numericCode?: string;

  @ApiProperty({
    description: 'Number of minor units (decimal places)',
    example: 2,
  })
  minorUnits: number;

  @ApiPropertyOptional({
    description: 'Currency symbol',
    example: '$',
  })
  symbol?: string;

  @ApiProperty({
    description: 'Is currency active',
    example: true,
  })
  isActive: boolean;

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
