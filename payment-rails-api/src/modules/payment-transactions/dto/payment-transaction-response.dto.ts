import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PaymentDirection, TransactionStatus } from './create-payment-transaction.dto';

export class PaymentTransactionResponseDto {
  @ApiProperty({
    description: 'Transaction ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Transaction reference',
    example: 'FEDNOW-20240101-0000000001',
  })
  transactionRef: string;

  @ApiPropertyOptional({
    description: 'End-to-end ID',
  })
  endToEndId?: string;

  @ApiPropertyOptional({
    description: 'Instruction ID',
  })
  instructionId?: string;

  @ApiPropertyOptional({
    description: 'UETR',
  })
  uetr?: string;

  @ApiProperty({
    description: 'Payment rail ID',
  })
  railId: string;

  @ApiPropertyOptional({
    description: 'Payment product ID',
  })
  productId?: string;

  @ApiPropertyOptional({
    description: 'Workflow ID',
  })
  workflowId?: string;

  @ApiProperty({
    description: 'Payment direction',
    enum: PaymentDirection,
  })
  direction: PaymentDirection;

  @ApiProperty({
    description: 'Transaction status',
    enum: TransactionStatus,
  })
  status: TransactionStatus;

  @ApiPropertyOptional({
    description: 'Previous status',
    enum: TransactionStatus,
  })
  previousStatus?: TransactionStatus;

  @ApiProperty({
    description: 'Instructed amount',
  })
  instructedAmount: number;

  @ApiProperty({
    description: 'Instructed currency ID',
  })
  instructedCurrencyId: string;

  @ApiPropertyOptional({
    description: 'Settlement amount',
  })
  settlementAmount?: number;

  @ApiPropertyOptional({
    description: 'Settlement currency ID',
  })
  settlementCurrencyId?: string;

  @ApiPropertyOptional({
    description: 'Exchange rate',
  })
  exchangeRate?: number;

  @ApiProperty({
    description: 'Charges amount',
  })
  chargesAmount: number;

  @ApiProperty({
    description: 'Charge bearer',
  })
  chargeBearer: string;

  @ApiProperty({
    description: 'Creation timestamp',
  })
  creationDatetime: Date;

  @ApiPropertyOptional({
    description: 'Value date',
  })
  valueDate?: Date;

  @ApiPropertyOptional({
    description: 'Settlement date',
  })
  settlementDate?: Date;

  @ApiPropertyOptional({
    description: 'Completed timestamp',
  })
  completedDatetime?: Date;

  @ApiPropertyOptional({
    description: 'Purpose code',
  })
  purposeCode?: string;

  @ApiPropertyOptional({
    description: 'Purpose description',
  })
  purposeDescription?: string;

  @ApiPropertyOptional({
    description: 'Remittance information',
  })
  remittanceInfo?: string;

  @ApiPropertyOptional({
    description: 'Batch ID',
  })
  batchId?: string;

  @ApiPropertyOptional({
    description: 'Batch sequence',
  })
  batchSequence?: number;

  @ApiPropertyOptional({
    description: 'Current step ID',
  })
  currentStepId?: string;

  @ApiProperty({
    description: 'Retry count',
  })
  retryCount: number;

  @ApiProperty({
    description: 'Is suspicious',
  })
  isSuspicious: boolean;

  @ApiProperty({
    description: 'Requires HITL',
  })
  requiresHitl: boolean;

  @ApiPropertyOptional({
    description: 'Rail-specific data',
  })
  railSpecificData?: any;

  @ApiPropertyOptional({
    description: 'Original message',
  })
  originalMessage?: any;

  @ApiPropertyOptional({
    description: 'Transformed message',
  })
  transformedMessage?: any;

  @ApiPropertyOptional({
    description: 'Response message',
  })
  responseMessage?: any;

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

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata?: any;
}
