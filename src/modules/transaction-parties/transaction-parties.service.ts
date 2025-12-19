import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateTransactionPartyDto } from './dto/create-transaction-party.dto';
import { UpdateTransactionPartyDto } from './dto/update-transaction-party.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class TransactionPartiesService {
  private readonly logger = new Logger(TransactionPartiesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateTransactionPartyDto) {
    try {
      return await this.prisma.transactionParty.create({
        data: createDto,
        include: {
          paymentTransaction: true,
          country: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced transaction or country not found');
        }
      }
      this.logger.error('Error creating transaction party', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.transactionParty.findMany({
        skip,
        take,
        include: {
          paymentTransaction: true,
          country: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.transactionParty.count(),
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
    const party = await this.prisma.transactionParty.findUnique({
      where: { id },
      include: {
        paymentTransaction: true,
        country: true,
      },
    });

    if (!party) {
      throw new NotFoundException(`Transaction party with ID ${id} not found`);
    }

    return party;
  }

  async findByTransactionId(transactionId: string) {
    return this.prisma.transactionParty.findMany({
      where: { transactionId },
      include: {
        country: true,
      },
      orderBy: [{ partyType: 'asc' }, { partySequence: 'asc' }],
    });
  }

  async findByPartyType(partyType: string) {
    return this.prisma.transactionParty.findMany({
      where: { partyType: partyType as any },
      include: {
        paymentTransaction: true,
        country: true,
      },
      take: 100,
    });
  }

  async update(id: string, updateDto: UpdateTransactionPartyDto) {
    try {
      return await this.prisma.transactionParty.update({
        where: { id },
        data: updateDto,
        include: {
          paymentTransaction: true,
          country: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Transaction party with ID ${id} not found`);
        }
      }
      this.logger.error('Error updating transaction party', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.transactionParty.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Transaction party with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting transaction party', error);
      throw error;
    }
  }
}
