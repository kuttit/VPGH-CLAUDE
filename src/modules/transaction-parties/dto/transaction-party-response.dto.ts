import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class TransactionPartyResponseDto {
  @ApiProperty({
    description: 'Transaction Party ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Transaction ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  transactionId: string;

  @ApiProperty({
    description: 'Party type',
    example: 'DEBTOR',
  })
  partyType: string;

  @ApiProperty({
    description: 'Party sequence',
    example: 1,
  })
  partySequence: number;

  @ApiPropertyOptional({ description: 'Party name' })
  partyName?: string;

  @ApiPropertyOptional({ description: 'Party account number' })
  partyAccountNumber?: string;

  @ApiPropertyOptional({ description: 'Party account type' })
  partyAccountType?: string;

  @ApiPropertyOptional({ description: 'Party BIC' })
  partyBic?: string;

  @ApiPropertyOptional({ description: 'Party LEI' })
  partyLei?: string;

  @ApiPropertyOptional({ description: 'Party routing number' })
  partyRoutingNumber?: string;

  @ApiPropertyOptional({ description: 'Address line 1' })
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City' })
  city?: string;

  @ApiPropertyOptional({ description: 'State/Province' })
  stateProvince?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country ID' })
  countryId?: string;

  @ApiPropertyOptional({ description: 'Agent name' })
  agentName?: string;

  @ApiPropertyOptional({ description: 'Agent BIC' })
  agentBic?: string;

  @ApiPropertyOptional({ description: 'Agent routing number' })
  agentRoutingNumber?: string;

  @ApiPropertyOptional({ description: 'Agent account' })
  agentAccount?: string;

  @ApiPropertyOptional({ description: 'Party details' })
  partyDetails?: any;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Created timestamp', example: '2024-01-01T00:00:00.000Z' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp', example: '2024-01-01T00:00:00.000Z' })
  updatedAt: Date;
}
