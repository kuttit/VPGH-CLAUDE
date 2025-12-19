import { PartialType } from '@nestjs/swagger';
import { CreateHitlInterventionDto } from './create-hitl-intervention.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsBoolean, IsEnum, MaxLength } from 'class-validator';

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

export class UpdateHitlInterventionDto extends PartialType(CreateHitlInterventionDto) {
  @ApiPropertyOptional({ description: 'Action taken', enum: HitlActionType })
  @IsOptional()
  @IsEnum(HitlActionType)
  actionTaken?: HitlActionType;

  @ApiPropertyOptional({ description: 'Action notes' })
  @IsOptional()
  @IsString()
  actionNotes?: string;

  @ApiPropertyOptional({ description: 'Is resolved', default: false })
  @IsOptional()
  @IsBoolean()
  isResolved?: boolean;

  @ApiPropertyOptional({ description: 'Resolved by', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  resolvedBy?: string;

  @ApiPropertyOptional({ description: 'Is escalated', default: false })
  @IsOptional()
  @IsBoolean()
  isEscalated?: boolean;

  @ApiPropertyOptional({ description: 'Escalated to', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  escalatedTo?: string;
}
