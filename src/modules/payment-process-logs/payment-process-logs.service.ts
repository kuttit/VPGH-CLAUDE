import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentProcessLogDto } from './dto/create-payment-process-log.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentProcessLogsService {
  private readonly logger = new Logger(PaymentProcessLogsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreatePaymentProcessLogDto) {
    try {
      return await this.prisma.paymentProcessLog.create({
        data: createDto as any,
        include: { paymentTransaction: true, workflowDefinition: true, workflowStep: true },
      });
    } catch (error) {
      this.logger.error('Error creating payment process log', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.paymentProcessLog.findMany({
        skip,
        take,
        include: { paymentTransaction: true, workflowStep: true },
        orderBy: { eventTimestamp: 'desc' },
      }),
      this.prisma.paymentProcessLog.count(),
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
    const log = await this.prisma.paymentProcessLog.findUnique({
      where: { id },
      include: { paymentTransaction: true, workflowDefinition: true, workflowStep: true },
    });

    if (!log) {
      throw new NotFoundException(`Payment process log with ID ${id} not found`);
    }

    return log;
  }

  async findByTransactionId(transactionId: string) {
    return this.prisma.paymentProcessLog.findMany({
      where: { transactionId },
      include: { workflowStep: true },
      orderBy: { eventSequence: 'asc' },
    });
  }

  async findByEventType(eventType: string) {
    return this.prisma.paymentProcessLog.findMany({
      where: { eventType },
      include: { paymentTransaction: true },
      orderBy: { eventTimestamp: 'desc' },
      take: 100,
    });
  }

  async remove(id: string) {
    try {
      return await this.prisma.paymentProcessLog.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Payment process log with ID ${id} not found`);
      }
      throw error;
    }
  }
}
