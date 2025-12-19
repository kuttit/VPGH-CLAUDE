import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsObject, IsInt, MaxLength, Min, IsEnum } from 'class-validator';

enum PartyType {
  DEBTOR = 'DEBTOR',
  CREDITOR = 'CREDITOR',
  ORIGINATOR = 'ORIGINATOR',
  BENEFICIARY = 'BENEFICIARY',
  INTERMEDIARY = 'INTERMEDIARY',
  CORRESPONDENT = 'CORRESPONDENT',
}

export class CreateTransactionPartyDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  transactionId: string;

  @ApiProperty({
    description: 'Party type',
    enum: PartyType,
    example: 'DEBTOR',
  })
  @IsEnum(PartyType)
  partyType: PartyType;

  @ApiPropertyOptional({
    description: 'Party sequence (for multiple parties of same type)',
    example: 1,
    default: 1,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  partySequence?: number;

  @ApiPropertyOptional({
    description: 'Party name',
    example: 'John Doe',
    maxLength: 140,
  })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  partyName?: string;

  @ApiPropertyOptional({
    description: 'Party account number',
    example: '1234567890',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  partyAccountNumber?: string;

  @ApiPropertyOptional({
    description: 'Party account type',
    example: 'CHECKING',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  partyAccountType?: string;

  @ApiPropertyOptional({
    description: 'Party BIC/SWIFT code',
    example: 'BOFAUS3N',
    maxLength: 11,
  })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  partyBic?: string;

  @ApiPropertyOptional({
    description: 'Party LEI',
    example: '549300EXAMPLE0000001',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  partyLei?: string;

  @ApiPropertyOptional({
    description: 'Party routing number',
    example: '021000021',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  partyRoutingNumber?: string;

  @ApiPropertyOptional({
    description: 'Address line 1',
    example: '123 Main Street',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine1?: string;

  @ApiPropertyOptional({
    description: 'Address line 2',
    example: 'Suite 100',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  addressLine2?: string;

  @ApiPropertyOptional({
    description: 'City',
    example: 'New York',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  city?: string;

  @ApiPropertyOptional({
    description: 'State/Province',
    example: 'NY',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  stateProvince?: string;

  @ApiPropertyOptional({
    description: 'Postal code',
    example: '10001',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({
    description: 'Country ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  @IsOptional()
  @IsUUID()
  countryId?: string;

  @ApiPropertyOptional({
    description: 'Agent name',
    example: 'Bank of America',
    maxLength: 140,
  })
  @IsOptional()
  @IsString()
  @MaxLength(140)
  agentName?: string;

  @ApiPropertyOptional({
    description: 'Agent BIC',
    example: 'BOFAUS3N',
    maxLength: 11,
  })
  @IsOptional()
  @IsString()
  @MaxLength(11)
  agentBic?: string;

  @ApiPropertyOptional({
    description: 'Agent routing number',
    example: '021000021',
    maxLength: 20,
  })
  @IsOptional()
  @IsString()
  @MaxLength(20)
  agentRoutingNumber?: string;

  @ApiPropertyOptional({
    description: 'Agent account',
    example: '9876543210',
    maxLength: 50,
  })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  agentAccount?: string;

  @ApiPropertyOptional({
    description: 'Party details (additional data)',
    example: {},
  })
  @IsOptional()
  @IsObject()
  partyDetails?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
    example: {},
  })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
