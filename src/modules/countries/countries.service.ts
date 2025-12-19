import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class CountriesService {
  private readonly logger = new Logger(CountriesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createCountryDto: CreateCountryDto) {
    try {
      return await this.prisma.country.create({
        data: createCountryDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Country with this code already exists');
        }
      }
      this.logger.error('Error creating country', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.country.findMany({
        skip,
        take,
        orderBy: { countryName: 'asc' },
      }),
      this.prisma.country.count(),
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
    const country = await this.prisma.country.findUnique({
      where: { id },
    });

    if (!country) {
      throw new NotFoundException(`Country with ID ${id} not found`);
    }

    return country;
  }

  async findByCode(code: string) {
    const country = await this.prisma.country.findUnique({
      where: { countryCode: code },
    });

    if (!country) {
      throw new NotFoundException(`Country with code ${code} not found`);
    }

    return country;
  }

  async update(id: string, updateCountryDto: UpdateCountryDto) {
    try {
      return await this.prisma.country.update({
        where: { id },
        data: updateCountryDto,
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Country with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Country with this code already exists');
        }
      }
      this.logger.error('Error updating country', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.country.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Country with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting country', error);
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.country.findMany({
      where: {
        OR: [
          { countryName: { contains: query, mode: 'insensitive' } },
          { countryCode: { contains: query, mode: 'insensitive' } },
          { countryCodeAlpha2: { contains: query, mode: 'insensitive' } },
        ],
      },
      take: 20,
    });
  }
}
