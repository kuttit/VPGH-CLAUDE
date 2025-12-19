import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsBoolean, IsOptional, IsUUID, IsObject, IsEnum, MaxLength } from 'class-validator';

enum ErrorSeverity {
  INFO = 'INFO',
  WARNING = 'WARNING',
  ERROR = 'ERROR',
  CRITICAL = 'CRITICAL',
  FATAL = 'FATAL',
}

export class CreatePaymentErrorLogDto {
  @ApiPropertyOptional({ description: 'Transaction ID' })
  @IsOptional()
  @IsUUID()
  transactionId?: string;

  @ApiPropertyOptional({ description: 'Process Log ID' })
  @IsOptional()
  @IsUUID()
  processLogId?: string;

  @ApiPropertyOptional({ description: 'Workflow ID' })
  @IsOptional()
  @IsUUID()
  workflowId?: string;

  @ApiPropertyOptional({ description: 'Step ID' })
  @IsOptional()
  @IsUUID()
  stepId?: string;

  @ApiProperty({ description: 'Error ID', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  errorId: string;

  @ApiProperty({ description: 'Error code', maxLength: 50 })
  @IsString()
  @MaxLength(50)
  errorCode: string;

  @ApiPropertyOptional({ description: 'Error category', maxLength: 50 })
  @IsOptional()
  @IsString()
  @MaxLength(50)
  errorCategory?: string;

  @ApiPropertyOptional({ description: 'Error severity', enum: ErrorSeverity, default: 'ERROR' })
  @IsOptional()
  @IsEnum(ErrorSeverity)
  errorSeverity?: ErrorSeverity;

  @ApiProperty({ description: 'Error message' })
  @IsString()
  errorMessage: string;

  @ApiPropertyOptional({ description: 'Error description' })
  @IsOptional()
  @IsString()
  errorDescription?: string;

  @ApiPropertyOptional({ description: 'Stack trace' })
  @IsOptional()
  @IsString()
  stackTrace?: string;

  @ApiPropertyOptional({ description: 'Source system', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  sourceSystem?: string;

  @ApiPropertyOptional({ description: 'Requires HITL', default: false })
  @IsOptional()
  @IsBoolean()
  requiresHitl?: boolean;

  @ApiPropertyOptional({ description: 'Error details' })
  @IsOptional()
  @IsObject()
  errorDetails?: any;

  @ApiPropertyOptional({ description: 'Metadata' })
  @IsOptional()
  @IsObject()
  metadata?: any;
}
