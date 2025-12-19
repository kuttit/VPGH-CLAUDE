import { PartialType } from '@nestjs/swagger';
import { CreateValidationRuleDto } from './create-validation-rule.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateValidationRuleDto extends PartialType(CreateValidationRuleDto) {
  @ApiPropertyOptional({
    description: 'Updated by user',
    example: 'admin',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  updatedBy?: string;
}
