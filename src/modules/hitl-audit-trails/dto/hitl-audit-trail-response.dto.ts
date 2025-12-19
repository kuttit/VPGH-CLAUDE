import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class HitlAuditTrailResponseDto {
  @ApiProperty({ description: 'Audit ID' })
  id: string;

  @ApiProperty({ description: 'Intervention ID' })
  interventionId: string;

  @ApiProperty({ description: 'Transaction ID' })
  transactionId: string;

  @ApiProperty({ description: 'Action type' })
  actionType: string;

  @ApiProperty({ description: 'Action by' })
  actionBy: string;

  @ApiProperty({ description: 'Action at' })
  actionAt: Date;

  @ApiPropertyOptional({ description: 'Previous state' })
  previousState?: any;

  @ApiPropertyOptional({ description: 'New state' })
  newState?: any;

  @ApiPropertyOptional({ description: 'Action reason' })
  actionReason?: string;

  @ApiPropertyOptional({ description: 'Action notes' })
  actionNotes?: string;

  @ApiPropertyOptional({ description: 'IP address' })
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'Metadata' })
  metadata?: any;
}
