import { PartialType } from '@nestjs/swagger';
import { CreatePaymentRailCountryDto } from './create-payment-rail-country.dto';

export class UpdatePaymentRailCountryDto extends PartialType(CreatePaymentRailCountryDto) {}
