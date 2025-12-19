import { Module } from '@nestjs/common';
import { PaymentProductsService } from './payment-products.service';
import { PaymentProductsController } from './payment-products.controller';

@Module({
  controllers: [PaymentProductsController],
  providers: [PaymentProductsService],
  exports: [PaymentProductsService],
})
export class PaymentProductsModule {}
