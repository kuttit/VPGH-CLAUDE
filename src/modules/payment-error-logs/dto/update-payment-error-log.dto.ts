import { PartialType } from '@nestjs/swagger';
import { CreatePaymentErrorLogDto } from './create-payment-error-log.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, MaxLength } from 'class-validator';

export class UpdatePaymentErrorLogDto extends PartialType(CreatePaymentErrorLogDto) {
  @ApiPropertyOptional({ description: 'Is resolved', default: false })
  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

  @ApiPropertyOptional({ description: 'Resolved by', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  resolvedBy?: string;

  @ApiPropertyOptional({ description: 'Resolution notes' })
  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}
