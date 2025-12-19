import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentErrorLogDto } from './dto/create-payment-error-log.dto';
import { UpdatePaymentErrorLogDto } from './dto/update-payment-error-log.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentErrorLogsService {
  private readonly logger = new Logger(PaymentErrorLogsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePaymentErrorLogDto) {
    return this.prisma.paymentErrorLog.create({
      data: createDto as any,
      include: { paymentTransaction: true },
    });
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.paymentErrorLog.findMany({
        skip,
        take,
        include: { paymentTransaction: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.paymentErrorLog.count(),
    ]);

    return { data, total, page: skip && take ? Math.floor(skip / take) + 1 : 1, limit: take || total, totalPages: take ? Math.ceil(total / take) : 1 };
  }

  async findOne(id: string) {
    const log = await this.prisma.paymentErrorLog.findUnique({
      where: { id },
      include: { paymentTransaction: true, paymentProcessLog: true },
    });
    if (!log) throw new NotFoundException(`Payment error log with ID ${id} not found`);
    return log;
  }

  async findByTransactionId(transactionId: string) {
    return this.prisma.paymentErrorLog.findMany({
      where: { transactionId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnresolved() {
    return this.prisma.paymentErrorLog.findMany({
      where: { isResolved: false },
      include: { paymentTransaction: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async update(id: string, updateDto: UpdatePaymentErrorLogDto) {
    try {
      const data: any = { ...updateDto };
      if (updateDto.isResolved && !updateDto.resolvedBy) {
        data.resolvedAt = new Date();
      }
      return await this.prisma.paymentErrorLog.update({
        where: { id },
        data,
        include: { paymentTransaction: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Payment error log with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.paymentErrorLog.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Payment error log with ID ${id} not found`);
      }
      throw error;
    }
  }
}
