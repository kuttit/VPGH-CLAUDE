import { Module } from '@nestjs/common';
import { PaymentRailsService } from './payment-rails.service';
import { PaymentRailsController } from './payment-rails.controller';

@Module({
  controllers: [PaymentRailsController],
  providers: [PaymentRailsService],
  exports: [PaymentRailsService],
})
export class PaymentRailsModule {}
