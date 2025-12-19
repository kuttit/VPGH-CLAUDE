import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentRailCurrencyDto } from './dto/create-payment-rail-currency.dto';
import { UpdatePaymentRailCurrencyDto } from './dto/update-payment-rail-currency.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentRailCurrenciesService {
  private readonly logger = new Logger(PaymentRailCurrenciesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentRailCurrencyDto: CreatePaymentRailCurrencyDto) {
    try {
      return await this.prisma.paymentRailCurrency.create({
        data: createPaymentRailCurrencyDto,
        include: {
          paymentRail: true,
          currency: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('This rail-currency combination already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced payment rail or currency not found');
        }
      }
      this.logger.error('Error creating payment rail currency', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.paymentRailCurrency.findMany({
        skip,
        take,
        include: {
          paymentRail: true,
          currency: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.paymentRailCurrency.count(),
    ]);

    return {
      data,
      total,
      page: skip && take ? Math.floor(skip / take) + 1 : 1,
      limit: take || total,
      totalPages: take ? Math.ceil(total / take) : 1,
    };
  }

  async findOne(id: string) {
    const paymentRailCurrency = await this.prisma.paymentRailCurrency.findUnique({
      where: { id },
      include: {
        paymentRail: true,
        currency: true,
      },
    });

    if (!paymentRailCurrency) {
      throw new NotFoundException(`Payment rail currency with ID ${id} not found`);
    }

    return paymentRailCurrency;
  }

  async findByRailId(railId: string) {
    return this.prisma.paymentRailCurrency.findMany({
      where: { railId },
      include: {
        paymentRail: true,
        currency: true,
      },
    });
  }

  async findByCurrencyId(currencyId: string) {
    return this.prisma.paymentRailCurrency.findMany({
      where: { currencyId },
      include: {
        paymentRail: true,
        currency: true,
      },
    });
  }

  async update(id: string, updatePaymentRailCurrencyDto: UpdatePaymentRailCurrencyDto) {
    try {
      return await this.prisma.paymentRailCurrency.update({
        where: { id },
        data: updatePaymentRailCurrencyDto,
        include: {
          paymentRail: true,
          currency: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment rail currency with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('This rail-currency combination already exists');
        }
      }
      this.logger.error('Error updating payment rail currency', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.paymentRailCurrency.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment rail currency with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting payment rail currency', error);
      throw error;
    }
  }
}
