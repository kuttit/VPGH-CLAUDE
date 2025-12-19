import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class PaymentProcessLogResponseDto {
  @ApiProperty({ description: 'Log ID' })
  id: string;

  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiPropertyOptional({ description: 'Workflow ID' })
  workflowId?: string;

  @ApiPropertyOptional({ description: 'Step ID' })
  stepId?: string;

  @ApiProperty({ description: 'Event ID' })
  eventId: string;

  @ApiProperty({ description: 'Event sequence' })
  eventSequence: number;

  @ApiProperty({ description: 'Event type' })
  eventType: string;

  @ApiProperty({ description: 'Event timestamp' })
  eventTimestamp: Date;

  @ApiProperty({ description: 'Execution status' })
  executionStatus: string;

  @ApiPropertyOptional({ description: 'Previous status' })
  previousStatus?: string;

  @ApiPropertyOptional({ description: 'Step code' })
  stepCode?: string;

  @ApiPropertyOptional({ description: 'Step name' })
  stepName?: string;

  @ApiPropertyOptional({ description: 'Duration in milliseconds' })
  durationMs?: number;

  @ApiPropertyOptional({ description: 'Input data' })
  inputData?: any;

  @ApiPropertyOptional({ description: 'Output data' })
  outputData?: any;

  @ApiProperty({ description: 'Is HITL triggered' })
  isHitlTriggered: boolean;

  @ApiPropertyOptional({ description: 'HITL reason' })
  hitlReason?: string;

  @ApiPropertyOptional({ description: 'Message' })
  message?: string;

  @ApiPropertyOptional({ description: 'Details' })
  details?: any;

  @ApiPropertyOptional({ description: 'Metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;
}
