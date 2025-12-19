import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentProductResponseDto {
  @ApiProperty({
    description: 'Payment Product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Payment Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  railId: string;

  @ApiProperty({
    description: 'Product code',
    example: 'INST_PAY',
  })
  productCode: string;

  @ApiProperty({
    description: 'Product name',
    example: 'Instant Payment',
  })
  productName: string;

  @ApiPropertyOptional({
    description: 'Product description',
    example: 'Real-time instant payment service',
  })
  productDescription?: string;

  @ApiPropertyOptional({
    description: 'Product type',
    example: 'INSTANT',
  })
  productType?: string;

  @ApiProperty({
    description: 'Is instant payment',
    example: true,
  })
  isInstant: boolean;

  @ApiProperty({
    description: 'Requires response',
    example: false,
  })
  requiresResponse: boolean;

  @ApiPropertyOptional({
    description: 'Maximum transaction amount',
    example: 100000.00,
  })
  maxAmount?: number;

  @ApiProperty({
    description: 'Minimum transaction amount',
    example: 0,
  })
  minAmount: number;

  @ApiPropertyOptional({
    description: 'Fee structure configuration',
  })
  feeStructure?: any;

  @ApiPropertyOptional({
    description: 'Product configuration',
  })
  productConfig?: any;

  @ApiPropertyOptional({
    description: 'Validation rules configuration',
  })
  validationRules?: any;

  @ApiProperty({
    description: 'Is product active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata?: any;

  @ApiPropertyOptional({
    description: 'Created by user',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Updated by user',
  })
  updatedBy?: string;

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
