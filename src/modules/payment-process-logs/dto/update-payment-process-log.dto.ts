import { PartialType } from '@nestjs/swagger';
import { CreatePaymentProcessLogDto } from './create-payment-process-log.dto';

export class UpdatePaymentProcessLogDto extends PartialType(CreatePaymentProcessLogDto) {}
