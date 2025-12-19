import { PartialType } from '@nestjs/swagger';
import { CreateWorkflowDefinitionDto } from './create-workflow-definition.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdateWorkflowDefinitionDto extends PartialType(CreateWorkflowDefinitionDto) {
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
