import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { CountriesModule } from './modules/countries/countries.module';
import { CurrenciesModule } from './modules/currencies/currencies.module';
import { PaymentRailsModule } from './modules/payment-rails/payment-rails.module';
import { PaymentTransactionsModule } from './modules/payment-transactions/payment-transactions.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),
    PrismaModule,
    CountriesModule,
    CurrenciesModule,
    PaymentRailsModule,
    PaymentTransactionsModule,
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
