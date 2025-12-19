import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { PaymentRailsModule } from './modules/payment-rails/payment-rails.module';
import { PaymentTransactionsModule } from './modules/payment-transactions/payment-transactions.module';
import { PaymentProductsModule } from './modules/payment-products/payment-products.module';
import { PaymentRailCountriesModule } from './modules/payment-rail-countries/payment-rail-countries.module';
import { PaymentRailCurrenciesModule } from './modules/payment-rail-currencies/payment-rail-currencies.module';
import { WorkflowDefinitionsModule } from './modules/workflow-definitions/workflow-definitions.module';
import { WorkflowStepsModule } from './modules/workflow-steps/workflow-steps.module';
import { WorkflowStepTransitionsModule } from './modules/workflow-step-transitions/workflow-step-transitions.module';
import { ValidationRulesModule } from './modules/validation-rules/validation-rules.module';
import { RoutingRulesModule } from './modules/routing-rules/routing-rules.module';
import { TransactionPartiesModule } from './modules/transaction-parties/transaction-parties.module';
import { PaymentProcessLogsModule } from './modules/payment-process-logs/payment-process-logs.module';
import { PaymentErrorLogsModule } from './modules/payment-error-logs/payment-error-logs.module';
import { HitlInterventionsModule } from './modules/hitl-interventions/hitl-interventions.module';
import { HitlAuditTrailsModule } from './modules/hitl-audit-trails/hitl-audit-trails.module';
import { SystemConfigurationsModule } from './modules/system-configurations/system-configurations.module';
import { FeeConfigurationsModule } from './modules/fee-configurations/fee-configurations.module';
import { AuditTrailsModule } from './modules/audit-trails/audit-trails.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    // Master Data
    CountriesModule,
    CurrenciesModule,
    // Payment Rails
    PaymentRailsModule,
    PaymentProductsModule,
    PaymentRailCountriesModule,
    PaymentRailCurrenciesModule,
    // Workflow Management
    WorkflowDefinitionsModule,
    WorkflowStepsModule,
    WorkflowStepTransitionsModule,
    // Rules
    ValidationRulesModule,
    RoutingRulesModule,
    // Transactions
    PaymentTransactionsModule,
    TransactionPartiesModule,
    // Logging & Monitoring
    PaymentProcessLogsModule,
    PaymentErrorLogsModule,
    // HITL (Human-in-the-Loop)
    HitlInterventionsModule,
    HitlAuditTrailsModule,
    // Configuration & Audit
    SystemConfigurationsModule,
    FeeConfigurationsModule,
    AuditTrailsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
