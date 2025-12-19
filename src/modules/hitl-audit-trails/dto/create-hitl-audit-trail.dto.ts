import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsUUID, IsObject, IsEnum, MaxLength } from 'class-validator';

enum HitlActionType {
  APPROVE = 'APPROVE',
  REJECT = 'REJECT',
  RETRY = 'RETRY',
  RESTART = 'RESTART',
  SKIP = 'SKIP',
  ESCALATE = 'ESCALATE',
  MODIFY = 'MODIFY',
  CANCEL = 'CANCEL',
  FORCE_COMPLETE = 'FORCE_COMPLETE',
}

export class CreateHitlAuditTrailDto {
  @ApiProperty({ description: 'Intervention ID' })
  @IsUUID()
  interventionId: string;

  @ApiProperty({ description: 'Transaction ID' })
  @IsUUID()
  transactionId: string;

  @ApiProperty({ description: 'Action type', enum: HitlActionType })
  @IsEnum(HitlActionType)
  actionType: HitlActionType;

  @ApiProperty({ description: 'Action by user', maxLength: 100 })
  @IsString()
  @MaxLength(100)
  actionBy: string;

  @ApiPropertyOptional({ description: 'Previous state' })
  @IsOptional()
  @IsObject()
  previousState?: any;

  @ApiPropertyOptional({ description: 'New state' })
  @IsOptional()
  @IsObject()
  newState?: any;

  @ApiPropertyOptional({ description: 'Action reason' })
  @IsOptional()
  @IsString()
  actionReason?: string;

  @ApiPropertyOptional({ description: 'Action notes' })
  @IsOptional()
  @IsString()
  actionNotes?: string;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @IsOptional()
  @IsString()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
