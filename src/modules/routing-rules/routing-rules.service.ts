import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateRoutingRuleDto } from './dto/create-routing-rule.dto';
import { UpdateRoutingRuleDto } from './dto/update-routing-rule.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class RoutingRulesService {
  private readonly logger = new Logger(RoutingRulesService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateRoutingRuleDto) {
    try {
      return await this.prisma.routingRule.create({
        data: createDto,
        include: {
          targetRail: true,
          fallbackRail: true,
          targetProduct: true,
          countryFrom: true,
          countryTo: true,
          currency: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Routing rule with this code already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced entity not found');
        }
      }
      this.logger.error('Error creating routing rule', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.routingRule.findMany({
        skip,
        take,
        include: {
          targetRail: true,
          fallbackRail: true,
          targetProduct: true,
          countryFrom: true,
          countryTo: true,
          currency: true,
        },
        orderBy: [{ rulePriority: 'asc' }, { ruleName: 'asc' }],
      }),
      this.prisma.routingRule.count(),
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
    const rule = await this.prisma.routingRule.findUnique({
      where: { id },
      include: {
        targetRail: true,
        fallbackRail: true,
        targetProduct: true,
        countryFrom: true,
        countryTo: true,
        currency: true,
      },
    });

    if (!rule) {
      throw new NotFoundException(`Routing rule with ID ${id} not found`);
    }

    return rule;
  }

  async findByCode(ruleCode: string) {
    const rule = await this.prisma.routingRule.findUnique({
      where: { ruleCode },
      include: {
        targetRail: true,
        fallbackRail: true,
        targetProduct: true,
        countryFrom: true,
        countryTo: true,
        currency: true,
      },
    });

    if (!rule) {
      throw new NotFoundException(`Routing rule with code ${ruleCode} not found`);
    }

    return rule;
  }

  async findByTargetRailId(railId: string) {
    return this.prisma.routingRule.findMany({
      where: { targetRailId: railId },
      include: {
        targetRail: true,
        fallbackRail: true,
        targetProduct: true,
        countryFrom: true,
        countryTo: true,
        currency: true,
      },
      orderBy: { rulePriority: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdateRoutingRuleDto) {
    try {
      return await this.prisma.routingRule.update({
        where: { id },
        data: updateDto,
        include: {
          targetRail: true,
          fallbackRail: true,
          targetProduct: true,
          countryFrom: true,
          countryTo: true,
          currency: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Routing rule with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Routing rule with this code already exists');
        }
      }
      this.logger.error('Error updating routing rule', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.routingRule.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Routing rule with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting routing rule', error);
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.routingRule.findMany({
      where: {
        OR: [
          { ruleName: { contains: query, mode: 'insensitive' } },
          { ruleCode: { contains: query, mode: 'insensitive' } },
          { ruleDescription: { contains: query, mode: 'insensitive' } },
        ],
      },
      include: {
        targetRail: true,
        fallbackRail: true,
      },
      take: 20,
    });
  }
}
