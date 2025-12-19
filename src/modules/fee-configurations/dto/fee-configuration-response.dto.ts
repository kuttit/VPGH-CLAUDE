import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class FeeConfigurationResponseDto {
  @ApiProperty({ description: 'Fee Configuration ID' })
  id: string;

  @ApiProperty({ description: 'Payment Rail ID' })
  railId: string;

  @ApiPropertyOptional({ description: 'Payment Product ID' })
  productId?: string;

  @ApiProperty({ description: 'Fee code' })
  feeCode: string;

  @ApiProperty({ description: 'Fee name' })
  feeName: string;

  @ApiProperty({ description: 'Fee type' })
  feeType: string;

  @ApiPropertyOptional({ description: 'Fixed fee amount' })
  feeAmount?: number;

  @ApiPropertyOptional({ description: 'Fee percentage' })
  feePercentage?: number;

  @ApiPropertyOptional({ description: 'Minimum fee' })
  minFee?: number;

  @ApiPropertyOptional({ description: 'Maximum fee' })
  maxFee?: number;

  @ApiPropertyOptional({ description: 'Currency ID' })
  currencyId?: string;

  @ApiPropertyOptional({ description: 'Amount range from' })
  amountFrom?: number;

  @ApiPropertyOptional({ description: 'Amount range to' })
  amountTo?: number;

  @ApiPropertyOptional({ description: 'Tier configuration' })
  tierConfig?: any;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Effective from' })
  effectiveFrom?: Date;

  @ApiPropertyOptional({ description: 'Effective to' })
  effectiveTo?: Date;

  @ApiPropertyOptional({ description: 'Metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}
