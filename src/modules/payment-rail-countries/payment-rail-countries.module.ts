import { Module } from '@nestjs/common';
import { PaymentRailCountriesService } from './payment-rail-countries.service';
import { PaymentRailCountriesController } from './payment-rail-countries.controller';

@Module({
  controllers: [PaymentRailCountriesController],
  providers: [PaymentRailCountriesService],
  exports: [PaymentRailCountriesService],
})
export class PaymentRailCountriesModule {}
