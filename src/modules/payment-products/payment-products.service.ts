import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentProductDto } from './dto/create-payment-product.dto';
import { UpdatePaymentProductDto } from './dto/update-payment-product.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class PaymentProductsService {
  private readonly logger = new Logger(PaymentProductsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentProductDto: CreatePaymentProductDto) {
    try {
      return await this.prisma.paymentProduct.create({
        data: createPaymentProductDto,
        include: {
          paymentRail: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Payment product with this rail and code combination already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced payment rail not found');
        }
      }
      this.logger.error('Error creating payment product', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.paymentProduct.findMany({
        skip,
        take,
        orderBy: { productName: 'asc' },
        include: {
          paymentRail: true,
        },
      }),
      this.prisma.paymentProduct.count(),
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
    const paymentProduct = await this.prisma.paymentProduct.findUnique({
      where: { id },
      include: {
        paymentRail: true,
        feeConfigurations: true,
        workflowDefinitions: true,
      },
    });

    if (!paymentProduct) {
      throw new NotFoundException(`Payment product with ID ${id} not found`);
    }

    return paymentProduct;
  }

  async findByRailId(railId: string) {
    return this.prisma.paymentProduct.findMany({
      where: { railId },
      include: {
        paymentRail: true,
      },
    });
  }

  async update(id: string, updatePaymentProductDto: UpdatePaymentProductDto) {
    try {
      return await this.prisma.paymentProduct.update({
        where: { id },
        data: updatePaymentProductDto,
        include: {
          paymentRail: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment product with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Payment product with this rail and code combination already exists');
        }
      }
      this.logger.error('Error updating payment product', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.paymentProduct.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment product with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting payment product', error);
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.paymentProduct.findMany({
      where: {
        OR: [
          { productName: { contains: query, mode: 'insensitive' } },
          { productCode: { contains: query, mode: 'insensitive' } },
          { productDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        paymentRail: true,
      },
      take: 20,
    });
  }
}
