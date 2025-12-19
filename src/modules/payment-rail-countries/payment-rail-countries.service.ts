import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreatePaymentRailCountryDto } from './dto/create-payment-rail-country.dto';
import { UpdatePaymentRailCountryDto } from './dto/update-payment-rail-country.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class PaymentRailCountriesService {
  private readonly logger = new Logger(PaymentRailCountriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createPaymentRailCountryDto: CreatePaymentRailCountryDto) {
    try {
      return await this.prisma.paymentRailCountry.create({
        data: createPaymentRailCountryDto,
        include: {
          paymentRail: true,
          country: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('This rail-country combination already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced payment rail or country not found');
        }
      }
      this.logger.error('Error creating payment rail country', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.paymentRailCountry.findMany({
        skip,
        take,
        include: {
          paymentRail: true,
          country: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.paymentRailCountry.count(),
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
    const paymentRailCountry = await this.prisma.paymentRailCountry.findUnique({
      where: { id },
      include: {
        paymentRail: true,
        country: true,
      },
    });

    if (!paymentRailCountry) {
      throw new NotFoundException(`Payment rail country with ID ${id} not found`);
    }

    return paymentRailCountry;
  }

  async findByRailId(railId: string) {
    return this.prisma.paymentRailCountry.findMany({
      where: { railId },
      include: {
        paymentRail: true,
        country: true,
      },
    });
  }

  async findByCountryId(countryId: string) {
    return this.prisma.paymentRailCountry.findMany({
      where: { countryId },
      include: {
        paymentRail: true,
        country: true,
      },
    });
  }

  async update(id: string, updatePaymentRailCountryDto: UpdatePaymentRailCountryDto) {
    try {
      return await this.prisma.paymentRailCountry.update({
        where: { id },
        data: updatePaymentRailCountryDto,
        include: {
          paymentRail: true,
          country: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment rail country with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('This rail-country combination already exists');
        }
      }
      this.logger.error('Error updating payment rail country', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.paymentRailCountry.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Payment rail country with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting payment rail country', error);
      throw error;
    }
  }
}
