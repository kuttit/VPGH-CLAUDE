import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentRailCountryResponseDto {
  @ApiProperty({
    description: 'Payment Rail Country ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  railId: string;

  @ApiProperty({
    description: 'Country ID',
    example: '550e8400-e29b-41d4-a716-446655440002',
  })
  countryId: string;

  @ApiProperty({
    description: 'Is domestic payment supported',
    example: true,
  })
  isDomestic: boolean;

  @ApiProperty({
    description: 'Is cross-border payment supported',
    example: false,
  })
  isCrossBorder: boolean;

  @ApiProperty({
    description: 'Is the association active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Effective from date',
    example: '2024-01-01',
  })
  effectiveFrom?: Date;

  @ApiPropertyOptional({
    description: 'Effective to date',
    example: '2025-12-31',
  })
  effectiveTo?: Date;

  @ApiPropertyOptional({
    description: 'Country-specific configuration',
  })
  countrySpecificConfig?: any;

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
