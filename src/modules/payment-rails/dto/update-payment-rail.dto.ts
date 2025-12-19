import { PartialType } from '@nestjs/swagger';
import { CreatePaymentRailDto } from './create-payment-rail.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePaymentRailDto extends PartialType(CreatePaymentRailDto) {
  @ApiPropertyOptional({
    description: 'Updated by user',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
