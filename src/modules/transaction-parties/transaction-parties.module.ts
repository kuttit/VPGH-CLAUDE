import { Module } from '@nestjs/common';
import { TransactionPartiesService } from './transaction-parties.service';
import { TransactionPartiesController } from './transaction-parties.controller';

@Module({
  controllers: [TransactionPartiesController],
  providers: [TransactionPartiesService],
  exports: [TransactionPartiesService],
})
export class TransactionPartiesModule {}
