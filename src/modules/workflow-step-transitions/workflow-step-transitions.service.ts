import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkflowStepTransitionDto } from './dto/create-workflow-step-transition.dto';
import { UpdateWorkflowStepTransitionDto } from './dto/update-workflow-step-transition.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkflowStepTransitionsService {
  private readonly logger = new Logger(WorkflowStepTransitionsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createDto: CreateWorkflowStepTransitionDto) {
    try {
      return await this.prisma.workflowStepTransition.create({
        data: createDto,
        include: {
          workflowDefinition: true,
          fromStep: true,
          toStep: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced workflow definition or step not found');
        }
      }
      this.logger.error('Error creating workflow step transition', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.workflowStepTransition.findMany({
        skip,
        take,
        include: {
          workflowDefinition: true,
          fromStep: true,
          toStep: true,
        },
        orderBy: [{ workflowId: 'asc' }, { priority: 'asc' }],
      }),
      this.prisma.workflowStepTransition.count(),
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
    const transition = await this.prisma.workflowStepTransition.findUnique({
      where: { id },
      include: {
        workflowDefinition: true,
        fromStep: true,
        toStep: true,
      },
    });

    if (!transition) {
      throw new NotFoundException(`Workflow step transition with ID ${id} not found`);
    }

    return transition;
  }

  async findByWorkflowId(workflowId: string) {
    return this.prisma.workflowStepTransition.findMany({
      where: { workflowId },
      include: {
        workflowDefinition: true,
        fromStep: true,
        toStep: true,
      },
      orderBy: { priority: 'asc' },
    });
  }

  async findByFromStepId(fromStepId: string) {
    return this.prisma.workflowStepTransition.findMany({
      where: { fromStepId },
      include: {
        workflowDefinition: true,
        fromStep: true,
        toStep: true,
      },
      orderBy: { priority: 'asc' },
    });
  }

  async update(id: string, updateDto: UpdateWorkflowStepTransitionDto) {
    try {
      return await this.prisma.workflowStepTransition.update({
        where: { id },
        data: updateDto,
        include: {
          workflowDefinition: true,
          fromStep: true,
          toStep: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Workflow step transition with ID ${id} not found`);
        }
      }
      this.logger.error('Error updating workflow step transition', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.workflowStepTransition.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Workflow step transition with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting workflow step transition', error);
      throw error;
    }
  }
}
