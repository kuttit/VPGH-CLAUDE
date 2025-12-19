import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CurrenciesService {
  private readonly logger = new Logger(CurrenciesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCurrencyDto: CreateCurrencyDto) {
    try {
      return await this.prisma.currency.create({
        data: createCurrencyDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Currency with this code already exists');
        }
      }
      this.logger.error('Error creating currency', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.currency.findMany({
        skip,
        take,
        orderBy: { currencyCode: 'asc' },
      }),
      this.prisma.currency.count(),
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
    const currency = await this.prisma.currency.findUnique({
      where: { id },
    });

    if (!currency) {
      throw new NotFoundException(`Currency with ID ${id} not found`);
    }

    return currency;
  }

  async findByCode(code: string) {
    const currency = await this.prisma.currency.findUnique({
      where: { currencyCode: code },
    });

    if (!currency) {
      throw new NotFoundException(`Currency with code ${code} not found`);
    }

    return currency;
  }

  async update(id: string, updateCurrencyDto: UpdateCurrencyDto) {
    try {
      return await this.prisma.currency.update({
        where: { id },
        data: updateCurrencyDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Currency with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Currency with this code already exists');
        }
      }
      this.logger.error('Error updating currency', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.currency.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Currency with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting currency', error);
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.currency.findMany({
      where: {
        OR: [
          { currencyName: { contains: query, mode: 'insensitive' } },
          { currencyCode: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }
}
