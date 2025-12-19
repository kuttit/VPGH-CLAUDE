import { PartialType } from '@nestjs/swagger';
import { CreateSystemConfigurationDto } from './create-system-configuration.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateSystemConfigurationDto extends PartialType(CreateSystemConfigurationDto) {
  @ApiPropertyOptional({ description: 'Updated by', maxLength: 100 })
  @IsOptional()
  @IsString()
  @MaxLength(100)
  updatedBy?: string;
}
