import { PartialType } from '@nestjs/swagger';
import { CreatePaymentRailCurrencyDto } from './create-payment-rail-currency.dto';

export class UpdatePaymentRailCurrencyDto extends PartialType(CreatePaymentRailCurrencyDto) {}
