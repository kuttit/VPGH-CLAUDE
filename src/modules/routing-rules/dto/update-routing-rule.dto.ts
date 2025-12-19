import { PartialType } from '@nestjs/swagger';
import { CreateRoutingRuleDto } from './create-routing-rule.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateRoutingRuleDto extends PartialType(CreateRoutingRuleDto) {
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
