import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsObject, IsArray, MaxLength } from 'class-validator';

export class CreateAuditTrailDto {
  @ApiProperty({ description: 'Table name', example: 'payment_transactions', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  tableName: string;

  @ApiProperty({ description: 'Record ID' })
  @IsUUID()
  recordId: string;

  @ApiProperty({ description: 'Action (CREATE, UPDATE, DELETE)', example: 'UPDATE', maxLength: 20 })
  @IsString()
  @MaxLength(20)
  action: string;

  @ApiPropertyOptional({ description: 'Old values before change' })
  @IsOptional()
  @IsObject()
  oldValues?: any;

  @ApiPropertyOptional({ description: 'New values after change' })
  @IsOptional()
  @IsObject()
  newValues?: any;

  @ApiPropertyOptional({ description: 'List of changed fields', example: ['status', 'amount'] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  changedFields?: string[];

  @ApiPropertyOptional({ description: 'Changed by user', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  changedBy?: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Correlation ID', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  correlationId?: string;

  @ApiPropertyOptional({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
