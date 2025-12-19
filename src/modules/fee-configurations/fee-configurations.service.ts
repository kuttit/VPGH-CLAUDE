import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateFeeConfigurationDto } from './dto/create-fee-configuration.dto';
import { UpdateFeeConfigurationDto } from './dto/update-fee-configuration.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class FeeConfigurationsService {
  private readonly logger = new Logger(FeeConfigurationsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateFeeConfigurationDto) {
    return this.prisma.feeConfiguration.create({
      data: createDto as any,
      include: { paymentRail: true, paymentProduct: true, currency: true },
    });
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.feeConfiguration.findMany({
        skip,
        take,
        include: { paymentRail: true, paymentProduct: true, currency: true },
        orderBy: [{ railId: 'asc' }, { feeCode: 'asc' }],
      }),
      this.prisma.feeConfiguration.count(),
    ]);
    return { data, total, page: skip && take ? Math.floor(skip / take) + 1 : 1, limit: take || total, totalPages: take ? Math.ceil(total / take) : 1 };
  }

  async findOne(id: string) {
    const config = await this.prisma.feeConfiguration.findUnique({
      where: { id },
      include: { paymentRail: true, paymentProduct: true, currency: true },
    });
    if (!config) throw new NotFoundException(`Fee configuration with ID ${id} not found`);
    return config;
  }

  async findByRailId(railId: string) {
    return this.prisma.feeConfiguration.findMany({
      where: { railId },
      include: { paymentProduct: true, currency: true },
      orderBy: { feeCode: 'asc' },
    });
  }

  async findByProductId(productId: string) {
    return this.prisma.feeConfiguration.findMany({
      where: { productId },
      include: { paymentRail: true, currency: true },
      orderBy: { feeCode: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdateFeeConfigurationDto) {
    try {
      return await this.prisma.feeConfiguration.update({
        where: { id },
        data: updateDto as any,
        include: { paymentRail: true, paymentProduct: true, currency: true },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Fee configuration with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.feeConfiguration.delete({ where: { id } });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`Fee configuration with ID ${id} not found`);
      }
      throw error;
    }
  }
}
