import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHitlInterventionDto } from './dto/create-hitl-intervention.dto';
import { UpdateHitlInterventionDto } from './dto/update-hitl-intervention.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class HitlInterventionsService {
  private readonly logger = new Logger(HitlInterventionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateHitlInterventionDto) {
    return this.prisma.hitlIntervention.create({
      data: createDto as any,
      include: { paymentTransaction: true, workflowStep: true },
    });
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.hitlIntervention.findMany({
        skip,
        take,
        include: { paymentTransaction: true },
        orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
      }),
      this.prisma.hitlIntervention.count(),
    ]);
    return { data, total, page: skip && take ? Math.floor(skip / take) + 1 : 1, limit: take || total, totalPages: take ? Math.ceil(total / take) : 1 };
  }

  async findOne(id: string) {
    const intervention = await this.prisma.hitlIntervention.findUnique({
      where: { id },
      include: { paymentTransaction: true, workflowStep: true, paymentProcessLog: true, paymentErrorLog: true },
    });
    if (!intervention) throw new NotFoundException(`HITL intervention with ID ${id} not found`);
    return intervention;
  }

  async findActive() {
    return this.prisma.hitlIntervention.findMany({
      where: { isActive: true, isResolved: false },
      include: { paymentTransaction: true },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findByQueue(queueName: string) {
    return this.prisma.hitlIntervention.findMany({
      where: { queueName, isActive: true, isResolved: false },
      include: { paymentTransaction: true },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async findByAssignee(assignedTo: string) {
    return this.prisma.hitlIntervention.findMany({
      where: { assignedTo, isActive: true, isResolved: false },
      include: { paymentTransaction: true },
      orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    });
  }

  async update(id: string, updateDto: UpdateHitlInterventionDto) {
    try {
      const data: any = { ...updateDto };
      if (updateDto.isResolved) data.resolvedAt = new Date();
      if (updateDto.assignedTo && !data.assignedAt) data.assignedAt = new Date();
      return await this.prisma.hitlIntervention.update({
        where: { id },
        data,
        include: { paymentTransaction: true },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`HITL intervention with ID ${id} not found`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.hitlIntervention.delete({ where: { id } });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError && error.code === 'P2025') {
        throw new NotFoundException(`HITL intervention with ID ${id} not found`);
      }
      throw error;
    }
  }
}
