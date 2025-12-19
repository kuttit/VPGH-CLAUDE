import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateValidationRuleDto } from './dto/create-validation-rule.dto';
import { UpdateValidationRuleDto } from './dto/update-validation-rule.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class ValidationRulesService {
  private readonly logger = new Logger(ValidationRulesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateValidationRuleDto) {
    try {
      return await this.prisma.validationRule.create({
        data: createDto,
        include: {
          paymentRail: true,
          paymentProduct: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced payment rail or product not found');
        }
      }
      this.logger.error('Error creating validation rule', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.validationRule.findMany({
        skip,
        take,
        include: {
          paymentRail: true,
          paymentProduct: true,
        },
        orderBy: [{ rulePriority: 'asc' }, { ruleName: 'asc' }],
      }),
      this.prisma.validationRule.count(),
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
    const rule = await this.prisma.validationRule.findUnique({
      where: { id },
      include: {
        paymentRail: true,
        paymentProduct: true,
      },
    });

    if (!rule) {
      throw new NotFoundException(`Validation rule with ID ${id} not found`);
    }

    return rule;
  }

  async findByRailId(railId: string) {
    return this.prisma.validationRule.findMany({
      where: { railId },
      include: {
        paymentRail: true,
        paymentProduct: true,
      },
      orderBy: { rulePriority: 'asc' },
    });
  }

  async findByCategory(category: string) {
    return this.prisma.validationRule.findMany({
      where: { ruleCategory: category },
      include: {
        paymentRail: true,
        paymentProduct: true,
      },
      orderBy: { rulePriority: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdateValidationRuleDto) {
    try {
      return await this.prisma.validationRule.update({
        where: { id },
        data: updateDto,
        include: {
          paymentRail: true,
          paymentProduct: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Validation rule with ID ${id} not found`);
        }
      }
      this.logger.error('Error updating validation rule', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.validationRule.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Validation rule with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting validation rule', error);
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.validationRule.findMany({
      where: {
        OR: [
          { ruleName: { contains: query, mode: 'insensitive' } },
          { ruleCode: { contains: query, mode: 'insensitive' } },
          { ruleDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        paymentRail: true,
        paymentProduct: true,
      },
      take: 20,
    });
  }
}
