import { Module } from '@nestjs/common';
import { PaymentProcessLogsService } from './payment-process-logs.service';
import { PaymentProcessLogsController } from './payment-process-logs.controller';

@Module({
  controllers: [PaymentProcessLogsController],
  providers: [PaymentProcessLogsService],
  exports: [PaymentProcessLogsService],
})
export class PaymentProcessLogsModule {}
