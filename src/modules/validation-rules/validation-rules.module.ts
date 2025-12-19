import { Module } from '@nestjs/common';
import { ValidationRulesService } from './validation-rules.service';
import { ValidationRulesController } from './validation-rules.controller';

@Module({
  controllers: [ValidationRulesController],
  providers: [ValidationRulesService],
  exports: [ValidationRulesService],
})
export class ValidationRulesModule {}
