import { Module } from '@nestjs/common';
import { PaymentErrorLogsService } from './payment-error-logs.service';
import { PaymentErrorLogsController } from './payment-error-logs.controller';

@Module({
  controllers: [PaymentErrorLogsController],
  providers: [PaymentErrorLogsService],
  exports: [PaymentErrorLogsService],
})
export class PaymentErrorLogsModule {}
