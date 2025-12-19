import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentTransactionDto } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { Prisma, TransactionStatus } from '@prisma/client';

@Injectable()
export class PaymentTransactionsService {
  private readonly logger = new Logger(PaymentTransactionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentTransactionDto: CreatePaymentTransactionDto) {
    try {
      return await this.prisma.paymentTransaction.create({
        data: {
          ...createPaymentTransactionDto,
          status: createPaymentTransactionDto.status || TransactionStatus.INITIATED,
        },
        include: {
          paymentRail: true,
          paymentProduct: true,
          instructedCurrency: true,
          settlementCurrency: true,
        },
      });
    } catch (error) {
      this.logger.error('Error creating payment transaction', error);
      throw error;
    }
  }

  async findAll(
    skip?: number,
    take?: number,
    status?: TransactionStatus,
    railId?: string,
    direction?: string,
  ) {
    const where: Prisma.PaymentTransactionWhereInput = {};

    if (status) {
      where.status = status;
    }
    if (railId) {
      where.railId = railId;
    }
    if (direction) {
      where.direction = direction as any;
    }

    const [data, total] = await Promise.all([
      this.prisma.paymentTransaction.findMany({
        where,
        skip,
        take,
        orderBy: { creationDatetime: 'desc' },
        include: {
          paymentRail: {
            select: {
              id: true,
              railCode: true,
              railName: true,
            },
          },
          paymentProduct: {
            select: {
              id: true,
              productCode: true,
              productName: true,
            },
          },
          instructedCurrency: {
            select: {
              id: true,
              currencyCode: true,
              symbol: true,
            },
          },
          settlementCurrency: {
            select: {
              id: true,
              currencyCode: true,
              symbol: true,
            },
          },
        },
      }),
      this.prisma.paymentTransaction.count({ where }),
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
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        paymentRail: true,
        paymentProduct: true,
        workflowDefinition: true,
        currentStep: true,
        instructedCurrency: true,
        settlementCurrency: true,
        transactionParties: {
          include: {
            country: true,
          },
        },
        paymentProcessLogs: {
          orderBy: {
            eventSequence: 'asc',
          },
          take: 50,
        },
        paymentErrorLogs: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        hitlInterventions: {
          where: {
            isActive: true,
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Payment transaction with ID ${id} not found`);
    }

    return transaction;
  }

  async findByRef(transactionRef: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { transactionRef },
      include: {
        paymentRail: true,
        paymentProduct: true,
        instructedCurrency: true,
        settlementCurrency: true,
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Payment transaction with ref ${transactionRef} not found`);
    }

    return transaction;
  }

  async update(id: string, updatePaymentTransactionDto: UpdatePaymentTransactionDto) {
    try {
      // Store previous status if status is being changed
      const existingTransaction = await this.prisma.paymentTransaction.findUnique({
        where: { id },
        select: { status: true },
      });

      const updateData: any = { ...updatePaymentTransactionDto };

      if (updatePaymentTransactionDto.status && existingTransaction) {
        updateData.previousStatus = existingTransaction.status;
      }

      return await this.prisma.paymentTransaction.update({
        where: { id },
        data: updateData,
        include: {
          paymentRail: true,
          paymentProduct: true,
          instructedCurrency: true,
          settlementCurrency: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment transaction with ID ${id} not found`);
        }
      }
      this.logger.error('Error updating payment transaction', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.paymentTransaction.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment transaction with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting payment transaction', error);
      throw error;
    }
  }

  async findSuspicious() {
    return this.prisma.paymentTransaction.findMany({
      where: {
        isSuspicious: true,
      },
      include: {
        paymentRail: true,
        instructedCurrency: true,
      },
      orderBy: {
        creationDatetime: 'desc',
      },
    });
  }

  async findRequiringHitl() {
    return this.prisma.paymentTransaction.findMany({
      where: {
        requiresHitl: true,
      },
      include: {
        paymentRail: true,
        instructedCurrency: true,
        hitlInterventions: {
          where: {
            isActive: true,
          },
        },
      },
      orderBy: {
        creationDatetime: 'desc',
      },
    });
  }

  async getTransactionJourney(id: string) {
    const transaction = await this.prisma.paymentTransaction.findUnique({
      where: { id },
      include: {
        paymentProcessLogs: {
          orderBy: {
            eventSequence: 'asc',
          },
        },
      },
    });

    if (!transaction) {
      throw new NotFoundException(`Payment transaction with ID ${id} not found`);
    }

    return {
      transaction: {
        id: transaction.id,
        transactionRef: transaction.transactionRef,
        status: transaction.status,
        direction: transaction.direction,
        instructedAmount: transaction.instructedAmount,
      },
      journey: transaction.paymentProcessLogs,
    };
  }
}
