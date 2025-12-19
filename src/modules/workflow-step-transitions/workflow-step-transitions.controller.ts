import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
} from '@nestjs/swagger';
import { WorkflowStepTransitionsService } from './workflow-step-transitions.service';
import { CreateWorkflowStepTransitionDto } from './dto/create-workflow-step-transition.dto';
import { UpdateWorkflowStepTransitionDto } from './dto/update-workflow-step-transition.dto';
import { WorkflowStepTransitionResponseDto } from './dto/workflow-step-transition-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Workflow Step Transitions')
@Controller('workflow-step-transitions')
export class WorkflowStepTransitionsController {
  constructor(private readonly service: WorkflowStepTransitionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new workflow step transition',
    description: 'Creates a transition between workflow steps',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The transition has been successfully created.',
    type: WorkflowStepTransitionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createDto: CreateWorkflowStepTransitionDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workflow step transitions',
    description: 'Retrieves a paginated list of all workflow step transitions',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of transitions.',
    type: [WorkflowStepTransitionResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.service.findAll(skip, limit);
  }

  @Get('workflow/:workflowId')
  @ApiOperation({
    summary: 'Get transitions by workflow ID',
    description: 'Retrieves all transitions for a workflow definition',
  })
  @ApiParam({ name: 'workflowId', description: 'Workflow Definition UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns transitions for the workflow.',
    type: [WorkflowStepTransitionResponseDto],
  })
  findByWorkflowId(@Param('workflowId') workflowId: string) {
    return this.service.findByWorkflowId(workflowId);
  }

  @Get('from-step/:fromStepId')
  @ApiOperation({
    summary: 'Get transitions from a step',
    description: 'Retrieves all transitions originating from a step',
  })
  @ApiParam({ name: 'fromStepId', description: 'From Step UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns transitions from the step.',
    type: [WorkflowStepTransitionResponseDto],
  })
  findByFromStepId(@Param('fromStepId') fromStepId: string) {
    return this.service.findByFromStepId(fromStepId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workflow step transition by ID',
    description: 'Retrieves a single transition by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Workflow Step Transition UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the transition.',
    type: WorkflowStepTransitionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transition not found.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a workflow step transition',
    description: 'Updates an existing transition',
  })
  @ApiParam({ name: 'id', description: 'Workflow Step Transition UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The transition has been successfully updated.',
    type: WorkflowStepTransitionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transition not found.',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateWorkflowStepTransitionDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a workflow step transition',
    description: 'Deletes a transition by ID',
  })
  @ApiParam({ name: 'id', description: 'Workflow Step Transition UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The transition has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transition not found.',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
