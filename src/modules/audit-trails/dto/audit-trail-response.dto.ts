import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AuditTrailResponseDto {
  @ApiProperty({ description: 'Audit Trail ID' })
  id: string;

  @ApiProperty({ description: 'Table name' })
  tableName: string;

  @ApiProperty({ description: 'Record ID' })
  recordId: string;

  @ApiProperty({ description: 'Action' })
  action: string;

  @ApiPropertyOptional({ description: 'Old values' })
  oldValues?: any;

  @ApiPropertyOptional({ description: 'New values' })
  newValues?: any;

  @ApiProperty({ description: 'Changed fields' })
  changedFields: string[];

  @ApiPropertyOptional({ description: 'Changed by' })
  changedBy?: string;

  @ApiProperty({ description: 'Changed at' })
  changedAt: Date;

  @ApiPropertyOptional({ description: 'IP address' })
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Correlation ID' })
  correlationId?: string;

  @ApiPropertyOptional({ description: 'Metadata' })
  metadata?: any;
}
