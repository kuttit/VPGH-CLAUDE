import { PartialType } from '@nestjs/swagger';
import { CreatePaymentProductDto } from './create-payment-product.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, MaxLength } from 'class-validator';

export class UpdatePaymentProductDto extends PartialType(CreatePaymentProductDto) {
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
