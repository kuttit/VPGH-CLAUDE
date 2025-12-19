import { Injectable, NotFoundException, ConflictException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class WorkflowStepsService {
  private readonly logger = new Logger(WorkflowStepsService.name);

  constructor(private readonly prisma: PrismaService) {}

  async create(createWorkflowStepDto: CreateWorkflowStepDto) {
    try {
      return await this.prisma.workflowStep.create({
        data: createWorkflowStepDto,
        include: {
          workflowDefinition: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ConflictException('Workflow step with this sequence or code already exists for the workflow');
        }
        if (error.code === 'P2003') {
          throw new NotFoundException('Referenced workflow definition not found');
        }
      }
      this.logger.error('Error creating workflow step', error);
      throw error;
    }
  }

  async findAll(skip?: number, take?: number) {
    const [data, total] = await Promise.all([
      this.prisma.workflowStep.findMany({
        skip,
        take,
        include: {
          workflowDefinition: true,
        },
        orderBy: [{ workflowId: 'asc' }, { stepSequence: 'asc' }],
      }),
      this.prisma.workflowStep.count(),
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
    const workflowStep = await this.prisma.workflowStep.findUnique({
      where: { id },
      include: {
        workflowDefinition: true,
        workflowStepTransitionsFrom: true,
        workflowStepTransitionsTo: true,
      },
    });

    if (!workflowStep) {
      throw new NotFoundException(`Workflow step with ID ${id} not found`);
    }

    return workflowStep;
  }

  async findByWorkflowId(workflowId: string) {
    return this.prisma.workflowStep.findMany({
      where: { workflowId },
      include: {
        workflowDefinition: true,
      },
      orderBy: { stepSequence: 'asc' },
    });
  }

  async findByStepType(stepType: string) {
    return this.prisma.workflowStep.findMany({
      where: { stepType: stepType as any },
      include: {
        workflowDefinition: true,
      },
    });
  }

  async update(id: string, updateWorkflowStepDto: UpdateWorkflowStepDto) {
    try {
      return await this.prisma.workflowStep.update({
        where: { id },
        data: updateWorkflowStepDto,
        include: {
          workflowDefinition: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Workflow step with ID ${id} not found`);
        }
        if (error.code === 'P2002') {
          throw new ConflictException('Workflow step with this sequence or code already exists for the workflow');
        }
      }
      this.logger.error('Error updating workflow step', error);
      throw error;
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.workflowStep.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2025') {
          throw new NotFoundException(`Workflow step with ID ${id} not found`);
        }
      }
      this.logger.error('Error deleting workflow step', error);
      throw error;
    }
  }
}
