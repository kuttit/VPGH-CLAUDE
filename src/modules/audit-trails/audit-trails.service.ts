import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateAuditTrailDto } from './dto/create-audit-trail.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuditTrailsService {
  private readonly logger = new Logger(AuditTrailsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateAuditTrailDto) {
    return this.prisma.auditTrail.create({ data: createDto as any });
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.auditTrail.findMany({ skip, take, orderBy: { changedAt: 'desc' } }),
      this.prisma.auditTrail.count(),
    ]);
    return { data, total, page: skip && take ? Math.floor(skip / take) + 1 : 1, limit: take || total, totalPages: take ? Math.ceil(total / take) : 1 };
  }

  async findOne(id: string) {
    const trail = await this.prisma.auditTrail.findUnique({ where: { id } });
    if (!trail) throw new NotFoundException(`Audit trail with ID ${id} not found`);
    return trail;
  }

  async findByTableName(tableName: string) {
    return this.prisma.auditTrail.findMany({
      where: { tableName },
      orderBy: { changedAt: 'desc' },
      take: 100,
    });
  }

  async findByRecordId(recordId: string) {
    return this.prisma.auditTrail.findMany({
      where: { recordId },
      orderBy: { changedAt: 'asc' },
    });
  }

  async findByChangedBy(changedBy: string) {
    return this.prisma.auditTrail.findMany({
      where: { changedBy },
      orderBy: { changedAt: 'desc' },
      take: 100,
    });
  }

  async findByAction(action: string) {
    return this.prisma.auditTrail.findMany({
      where: { action },
      orderBy: { changedAt: 'desc' },
      take: 100,
    });
  }

  async findByCorrelationId(correlationId: string) {
    return this.prisma.auditTrail.findMany({
      where: { correlationId },
      orderBy: { changedAt: 'asc' },
    });
  }
}
