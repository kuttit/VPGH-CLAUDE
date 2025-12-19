import { PartialType } from '@nestjs/swagger';
import { CreatePaymentTransactionDto } from './create-payment-transaction.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';

export class UpdatePaymentTransactionDto extends PartialType(CreatePaymentTransactionDto) {
  @ApiPropertyOptional({
    description: 'Updated by user',
    maxLength: 100,
  })
  @IsOptional()
  @IsString()
  updatedBy?: string;
}
