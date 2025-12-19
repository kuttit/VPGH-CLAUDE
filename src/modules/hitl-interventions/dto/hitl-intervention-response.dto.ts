import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HitlInterventionResponseDto {
  @ApiProperty({ description: 'Intervention ID' })
  id: string;

  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Queue name' })
  queueName: string;

  @ApiProperty({ description: 'Priority' })
  priority: number;

  @ApiProperty({ description: 'Intervention context' })
  interventionContext: string;

  @ApiProperty({ description: 'Trigger reason' })
  triggerReason: string;

  @ApiPropertyOptional({ description: 'Assigned to' })
  assignedTo?: string;

  @ApiPropertyOptional({ description: 'Assigned at' })
  assignedAt?: Date;

  @ApiPropertyOptional({ description: 'Due at' })
  dueAt?: Date;

  @ApiProperty({ description: 'Is escalated' })
  isEscalated: boolean;

  @ApiPropertyOptional({ description: 'Action taken' })
  actionTaken?: string;

  @ApiPropertyOptional({ description: 'Action notes' })
  actionNotes?: string;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ description: 'Is resolved' })
  isResolved: boolean;

  @ApiPropertyOptional({ description: 'Resolved at' })
  resolvedAt?: Date;

  @ApiPropertyOptional({ description: 'Resolved by' })
  resolvedBy?: string;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}
