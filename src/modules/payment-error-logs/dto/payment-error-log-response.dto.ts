import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentErrorLogResponseDto {
  @ApiProperty({ description: 'Error Log ID' })
  id: string;

  @ApiPropertyOptional({ description: 'Transaction ID' })
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Process Log ID' })
  processLogId?: string;

  @ApiProperty({ description: 'Error ID' })
  errorId: string;

  @ApiProperty({ description: 'Error code' })
  errorCode: string;

  @ApiPropertyOptional({ description: 'Error category' })
  errorCategory?: string;

  @ApiProperty({ description: 'Error severity' })
  errorSeverity: string;

  @ApiProperty({ description: 'Error message' })
  errorMessage: string;

  @ApiPropertyOptional({ description: 'Error description' })
  errorDescription?: string;

  @ApiProperty({ description: 'Is resolved' })
  isResolved: boolean;

  @ApiPropertyOptional({ description: 'Resolved at' })
  resolvedAt?: Date;

  @ApiPropertyOptional({ description: 'Resolved by' })
  resolvedBy?: string;

  @ApiProperty({ description: 'Requires HITL' })
  requiresHitl: boolean;

  @ApiPropertyOptional({ description: 'Error details' })
  errorDetails?: any;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;
}
