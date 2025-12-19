import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkflowDefinitionDto } from './dto/create-workflow-definition.dto';
import { UpdateWorkflowDefinitionDto } from './dto/update-workflow-definition.dto';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class WorkflowDefinitionsService {
  private readonly logger = new Logger(WorkflowDefinitionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkflowDefinitionDto: CreateWorkflowDefinitionDto) {
    try {
      return await this.prisma.workflowDefinition.create({
        data: createWorkflowDefinitionDto,
        include: {
          paymentRail: true,
          paymentProduct: true,
          workflowSteps: true,
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Workflow definition with this combination already exists');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced payment rail or product not found');
        }
      }
      this.logger.error('Error creating workflow definition', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.workflowDefinition.findMany({
        skip,
        take,
        include: {
          paymentRail: true,
          paymentProduct: true,
          workflowSteps: {
            orderBy: { stepSequence: 'asc' },
          },
        },
        orderBy: { workflowName: 'asc' },
      }),
      this.prisma.workflowDefinition.count(),
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
    const workflowDefinition = await this.prisma.workflowDefinition.findUnique({
      where: { id },
      include: {
        paymentRail: true,
        paymentProduct: true,
        workflowSteps: {
          orderBy: { stepSequence: 'asc' },
        },
        workflowStepTransitions: true,
      },
    });

    if (!workflowDefinition) {
      throw new NotFoundException(`Workflow definition with ID ${id} not found`);
    }

    return workflowDefinition;
  }

  async findByRailId(railId: string) {
    return this.prisma.workflowDefinition.findMany({
      where: { railId },
      include: {
        paymentRail: true,
        paymentProduct: true,
        workflowSteps: {
          orderBy: { stepSequence: 'asc' },
        },
      },
    });
  }

  async findByCode(workflowCode: string) {
    return this.prisma.workflowDefinition.findMany({
      where: { workflowCode },
      include: {
        paymentRail: true,
        paymentProduct: true,
        workflowSteps: {
          orderBy: { stepSequence: 'asc' },
        },
      },
    });
  }

  async update(id: string, updateWorkflowDefinitionDto: UpdateWorkflowDefinitionDto) {
    try {
      return await this.prisma.workflowDefinition.update({
        where: { id },
        data: updateWorkflowDefinitionDto,
        include: {
          paymentRail: true,
          paymentProduct: true,
          workflowSteps: {
            orderBy: { stepSequence: 'asc' },
          },
        },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Workflow definition with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Workflow definition with this combination already exists');
        }
      }
      this.logger.error('Error updating workflow definition', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.workflowDefinition.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Workflow definition with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting workflow definition', error);
      throw error;
    }
  }

  async search(query: string) {
    return this.prisma.workflowDefinition.findMany({
      where: {
        OR: [
          { workflowName: { contains: query, mode: 'insensitive' } },
          { workflowCode: { contains: query, mode: 'insensitive' } },
          { workflowDescription: { contains: query, mode: 'insensitive' } },
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
