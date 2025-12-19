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
import { WorkflowStepsService } from './workflow-steps.service';
import { CreateWorkflowStepDto } from './dto/create-workflow-step.dto';
import { UpdateWorkflowStepDto } from './dto/update-workflow-step.dto';
import { WorkflowStepResponseDto } from './dto/workflow-step-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Workflow Steps')
@Controller('workflow-steps')
export class WorkflowStepsController {
  constructor(private readonly workflowStepsService: WorkflowStepsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new workflow step',
    description: 'Creates a new step in a workflow definition',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The workflow step has been successfully created.',
    type: WorkflowStepResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Workflow step with this sequence or code already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createWorkflowStepDto: CreateWorkflowStepDto) {
    return this.workflowStepsService.create(createWorkflowStepDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workflow steps',
    description: 'Retrieves a paginated list of all workflow steps',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of workflow steps.',
    type: [WorkflowStepResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.workflowStepsService.findAll(skip, limit);
  }

  @Get('workflow/:workflowId')
  @ApiOperation({
    summary: 'Get steps by workflow ID',
    description: 'Retrieves all steps for a workflow definition',
  })
  @ApiParam({ name: 'workflowId', description: 'Workflow Definition UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns steps for the workflow.',
    type: [WorkflowStepResponseDto],
  })
  findByWorkflowId(@Param('workflowId') workflowId: string) {
    return this.workflowStepsService.findByWorkflowId(workflowId);
  }

  @Get('type/:stepType')
  @ApiOperation({
    summary: 'Get steps by type',
    description: 'Retrieves all steps of a specific type',
  })
  @ApiParam({ name: 'stepType', description: 'Step type (e.g., VALIDATION, TRANSFORMATION)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns steps of the specified type.',
    type: [WorkflowStepResponseDto],
  })
  findByStepType(@Param('stepType') stepType: string) {
    return this.workflowStepsService.findByStepType(stepType);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workflow step by ID',
    description: 'Retrieves a single workflow step by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Workflow Step UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the workflow step.',
    type: WorkflowStepResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workflow step not found.',
  })
  findOne(@Param('id') id: string) {
    return this.workflowStepsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a workflow step',
    description: 'Updates an existing workflow step',
  })
  @ApiParam({ name: 'id', description: 'Workflow Step UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The workflow step has been successfully updated.',
    type: WorkflowStepResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workflow step not found.',
  })
  update(@Param('id') id: string, @Body() updateWorkflowStepDto: UpdateWorkflowStepDto) {
    return this.workflowStepsService.update(id, updateWorkflowStepDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a workflow step',
    description: 'Deletes a workflow step by ID',
  })
  @ApiParam({ name: 'id', description: 'Workflow Step UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The workflow step has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workflow step not found.',
  })
  remove(@Param('id') id: string) {
    return this.workflowStepsService.remove(id);
  }
}
