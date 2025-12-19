import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentRailCurrencyResponseDto {
  @ApiProperty({
    description: 'Payment Rail Currency ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  railId: string;

  @ApiProperty({
    description: 'Currency ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  currencyId: string;

  @ApiProperty({
    description: 'Is this the primary currency for the rail',
    example: false,
  })
  isPrimary: boolean;

  @ApiProperty({
    description: 'Is the association active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Exchange rate source',
    example: 'REUTERS',
  })
  exchangeRateSource?: string;

  @ApiPropertyOptional({
    description: 'Currency-specific configuration',
  })
  currencySpecificConfig?: any;

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
