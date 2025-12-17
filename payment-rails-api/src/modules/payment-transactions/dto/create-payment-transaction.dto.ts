import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsNumber, IsUUID, IsEnum, IsBoolean, IsOptional, IsObject, IsDateString } from 'class-validator';

export enum PaymentDirection {
  INBOUND = 'INBOUND',
  OUTBOUND = 'OUTBOUND',
  INTERNAL = 'INTERNAL',
}

export enum TransactionStatus {
  INITIATED = 'INITIATED',
  VALIDATED = 'VALIDATED',
  PENDING_APPROVAL = 'PENDING_APPROVAL',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PROCESSING = 'PROCESSING',
  SENT_TO_RAIL = 'SENT_TO_RAIL',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  SETTLED = 'SETTLED',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  RETURNED = 'RETURNED',
  SUSPICIOUS = 'SUSPICIOUS',
  ON_HOLD = 'ON_HOLD',
  PENDING_REVIEW = 'PENDING_REVIEW',
}

export class CreatePaymentTransactionDto {
  @ApiProperty({
    description: 'Transaction reference',
    example: 'FEDNOW-20240101-0000000001',
    maxLength: 50,
  })
  @IsString()
  transactionRef: string;

  @ApiPropertyOptional({
    description: 'End-to-end ID (ISO 20022)',
    example: 'E2E-REF-123456',
    maxLength: 35,
  })
  @IsOptional()
  @IsString()
  endToEndId?: string;

  @ApiPropertyOptional({
    description: 'Instruction ID (ISO 20022)',
    example: 'INSTR-123456',
    maxLength: 35,
  })
  @IsOptional()
  @IsString()
  instructionId?: string;

  @ApiPropertyOptional({
    description: 'Unique End-to-end Transaction Reference',
    example: '550e8400-e29b-41d4-a716-446655440000',
    maxLength: 36,
  })
  @IsOptional()
  @IsString()
  uetr?: string;

  @ApiProperty({
    description: 'Payment rail ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  railId: string;

  @ApiPropertyOptional({
    description: 'Payment product ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  productId?: string;

  @ApiPropertyOptional({
    description: 'Workflow ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  workflowId?: string;

  @ApiProperty({
    description: 'Payment direction',
    enum: PaymentDirection,
    example: PaymentDirection.OUTBOUND,
  })
  @IsEnum(PaymentDirection)
  direction: PaymentDirection;

  @ApiPropertyOptional({
    description: 'Transaction status',
    enum: TransactionStatus,
    example: TransactionStatus.INITIATED,
    default: TransactionStatus.INITIATED,
  })
  @IsOptional()
  @IsEnum(TransactionStatus)
  status?: TransactionStatus;

  @ApiProperty({
    description: 'Instructed amount',
    example: 1000.50,
  })
  @IsNumber()
  instructedAmount: number;

  @ApiProperty({
    description: 'Instructed currency ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsUUID()
  instructedCurrencyId: string;

  @ApiPropertyOptional({
    description: 'Settlement amount',
    example: 1000.50,
  })
  @IsOptional()
  @IsNumber()
  settlementAmount?: number;

  @ApiPropertyOptional({
    description: 'Settlement currency ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  settlementCurrencyId?: string;

  @ApiPropertyOptional({
    description: 'Exchange rate',
    example: 1.0850,
  })
  @IsOptional()
  @IsNumber()
  exchangeRate?: number;

  @ApiPropertyOptional({
    description: 'Charges amount',
    example: 2.50,
    default: 0,
  })
  @IsOptional()
  @IsNumber()
  chargesAmount?: number;

  @ApiPropertyOptional({
    description: 'Charge bearer',
    example: 'SLEV',
    maxLength: 20,
    default: 'SLEV',
  })
  @IsOptional()
  @IsString()
  chargeBearer?: string;

  @ApiPropertyOptional({
    description: 'Value date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  valueDate?: string;

  @ApiPropertyOptional({
    description: 'Settlement date',
    example: '2024-01-01',
  })
  @IsOptional()
  @IsDateString()
  settlementDate?: string;

  @ApiPropertyOptional({
    description: 'Purpose code',
    example: 'SALA',
    maxLength: 10,
  })
  @IsOptional()
  @IsString()
  purposeCode?: string;

  @ApiPropertyOptional({
    description: 'Purpose description',
    example: 'Salary payment',
    maxLength: 140,
  })
  @IsOptional()
  @IsString()
  purposeDescription?: string;

  @ApiPropertyOptional({
    description: 'Remittance information',
    example: 'Invoice 12345',
  })
  @IsOptional()
  @IsString()
  remittanceInfo?: string;

  @ApiPropertyOptional({
    description: 'Batch ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  @IsOptional()
  @IsUUID()
  batchId?: string;

  @ApiPropertyOptional({
    description: 'Batch sequence number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  batchSequence?: number;

  @ApiPropertyOptional({
    description: 'Is transaction suspicious',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  isSuspicious?: boolean;

  @ApiPropertyOptional({
    description: 'Requires human in the loop',
    example: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  requiresHitl?: boolean;

  @ApiPropertyOptional({
    description: 'Rail-specific data',
    example: { fedwire_type: 'Basic', type_subtype: '1000' },
  })
  @IsOptional()
  @IsObject()
  railSpecificData?: any;

  @ApiPropertyOptional({
    description: 'Original message',
    example: { message_type: 'pacs.008', header: {} },
  })
  @IsOptional()
  @IsObject()
  originalMessage?: any;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiPropertyOptional({
    description: 'Created by user',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  createdBy?: string;
}
