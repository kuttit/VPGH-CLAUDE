import { Module } from '@nestjs/common';
import { PaymentRailCurrenciesService } from './payment-rail-currencies.service';
import { PaymentRailCurrenciesController } from './payment-rail-currencies.controller';

@Module({
  controllers: [PaymentRailCurrenciesController],
  providers: [PaymentRailCurrenciesService],
  exports: [PaymentRailCurrenciesService],
})
export class PaymentRailCurrenciesModule {}
