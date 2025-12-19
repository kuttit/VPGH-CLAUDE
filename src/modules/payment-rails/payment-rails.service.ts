import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentRailDto } from './dto/create-payment-rail.dto';
import { UpdatePaymentRailDto } from './dto/update-payment-rail.dto';
import { Prisma } from '@prisma/client';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentRailsService {
  private readonly logger = new Logger(PaymentRailsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentRailDto: CreatePaymentRailDto) {
    try {
      return await this.prisma.paymentRail.create({
        data: createPaymentRailDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Payment rail with this code already exists');
        }
      }
      this.logger.error('Error creating payment rail', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number, isActive?: boolean) {
    const where: Prisma.PaymentRailWhereInput = {};
    if (isActive !== undefined) {
      where.isActive = isActive;
    }

    const [data, total] = await Promise.all([
      this.prisma.paymentRail.findMany({
        where,
        skip,
        take,
        orderBy: { railName: 'asc' },
        include: {
          operatorCountry: true,
        },
      }),
      this.prisma.paymentRail.count({ where }),
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
    const paymentRail = await this.prisma.paymentRail.findUnique({
      where: { id },
      include: {
        operatorCountry: true,
        paymentProducts: true,
        paymentRailCountries: {
          include: {
            country: true,
          },
        },
        paymentRailCurrencies: {
          include: {
            currency: true,
          },
        },
      },
    });

    if (!paymentRail) {
      throw new NotFoundException(`Payment rail with ID ${id} not found`);
    }

    return paymentRail;
  }

  async findByCode(code: string) {
    const paymentRail = await this.prisma.paymentRail.findUnique({
      where: { railCode: code },
      include: {
        operatorCountry: true,
        paymentProducts: true,
      },
    });

    if (!paymentRail) {
      throw new NotFoundException(`Payment rail with code ${code} not found`);
    }

    return paymentRail;
  }

  async update(id: string, updatePaymentRailDto: UpdatePaymentRailDto) {
    try {
      return await this.prisma.paymentRail.update({
        where: { id },
        data: updatePaymentRailDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment rail with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Payment rail with this code already exists');
        }
      }
      this.logger.error('Error updating payment rail', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.paymentRail.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment rail with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting payment rail', error);
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.paymentRail.findMany({
      where: {
        OR: [
          { railName: { contains: query, mode: 'insensitive' } },
          { railCode: { contains: query, mode: 'insensitive' } },
          { railType: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }

  async findByType(railType: string) {
    return this.prisma.paymentRail.findMany({
      where: {
        railType,
        isActive: true,
      },
    });
  }
}
