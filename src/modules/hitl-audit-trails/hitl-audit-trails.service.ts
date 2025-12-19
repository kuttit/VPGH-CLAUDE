import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateHitlAuditTrailDto } from './dto/create-hitl-audit-trail.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class HitlAuditTrailsService {
  private readonly logger = new Logger(HitlAuditTrailsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateHitlAuditTrailDto) {
    return this.prisma.hitlAuditTrail.create({
      data: createDto as any,
      include: { hitlIntervention: true, paymentTransaction: true },
    });
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.hitlAuditTrail.findMany({
        skip,
        take,
        include: { hitlIntervention: true, paymentTransaction: true },
        orderBy: { actionAt: 'desc' },
      }),
      this.prisma.hitlAuditTrail.count(),
    ]);
    return { data, total, page: skip && take ? Math.floor(skip / take) + 1 : 1, limit: take || total, totalPages: take ? Math.ceil(total / take) : 1 };
  }

  async findOne(id: string) {
    const trail = await this.prisma.hitlAuditTrail.findUnique({
      where: { id },
      include: { hitlIntervention: true, paymentTransaction: true },
    });
    if (!trail) throw new NotFoundException(`HITL audit trail with ID ${id} not found`);
    return trail;
  }

  async findByInterventionId(interventionId: string) {
    return this.prisma.hitlAuditTrail.findMany({
      where: { interventionId },
      orderBy: { actionAt: 'asc' },
    });
  }

  async findByTransactionId(transactionId: string) {
    return this.prisma.hitlAuditTrail.findMany({
      where: { transactionId },
      include: { hitlIntervention: true },
      orderBy: { actionAt: 'desc' },
    });
  }

  async findByActionBy(actionBy: string) {
    return this.prisma.hitlAuditTrail.findMany({
      where: { actionBy },
      include: { hitlIntervention: true },
      orderBy: { actionAt: 'desc' },
      take: 100,
    });
  }
}
