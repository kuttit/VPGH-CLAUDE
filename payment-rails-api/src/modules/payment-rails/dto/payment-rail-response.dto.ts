import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentRailResponseDto {
  @ApiProperty({
    description: 'Rail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Unique rail code',
    example: 'FEDNOW',
  })
  railCode: string;

  @ApiProperty({
    description: 'Rail name',
    example: 'FedNow Service',
  })
  railName: string;

  @ApiPropertyOptional({
    description: 'Rail description',
  })
  railDescription?: string;

  @ApiProperty({
    description: 'Rail type',
    example: 'REAL_TIME',
  })
  railType: string;

  @ApiPropertyOptional({
    description: 'Operator name',
  })
  operatorName?: string;

  @ApiPropertyOptional({
    description: 'Operator country ID',
  })
  operatorCountryId?: string;

  @ApiProperty({
    description: 'Is real-time processing',
  })
  isRealTime: boolean;

  @ApiProperty({
    description: 'Is available 24x7',
  })
  is24x7: boolean;

  @ApiPropertyOptional({
    description: 'Settlement type',
  })
  settlementType?: string;

  @ApiPropertyOptional({
    description: 'Maximum transaction amount',
  })
  maxAmount?: number;

  @ApiProperty({
    description: 'Minimum transaction amount',
  })
  minAmount: number;

  @ApiPropertyOptional({
    description: 'Cutoff time',
  })
  cutoffTime?: string;

  @ApiPropertyOptional({
    description: 'Timezone',
  })
  timezone?: string;

  @ApiPropertyOptional({
    description: 'Message format',
  })
  messageFormat?: string;

  @ApiPropertyOptional({
    description: 'Version',
  })
  version?: string;

  @ApiProperty({
    description: 'Is rail active',
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Rail configuration',
  })
  railConfig?: any;

  @ApiPropertyOptional({
    description: 'API configuration',
  })
  apiConfig?: any;

  @ApiPropertyOptional({
    description: 'Security configuration',
  })
  securityConfig?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata?: any;

  @ApiProperty({
    description: 'Created timestamp',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
  })
  updatedAt: Date;

  @ApiPropertyOptional({
    description: 'Created by user',
  })
  createdBy?: string;

  @ApiPropertyOptional({
    description: 'Updated by user',
  })
  updatedBy?: string;
}
