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
import { WorkflowDefinitionsService } from './workflow-definitions.service';
import { CreateWorkflowDefinitionDto } from './dto/create-workflow-definition.dto';
import { UpdateWorkflowDefinitionDto } from './dto/update-workflow-definition.dto';
import { WorkflowDefinitionResponseDto } from './dto/workflow-definition-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Workflow Definitions')
@Controller('workflow-definitions')
export class WorkflowDefinitionsController {
  constructor(private readonly workflowDefinitionsService: WorkflowDefinitionsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new workflow definition',
    description: 'Creates a new workflow definition for payment processing',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The workflow definition has been successfully created.',
    type: WorkflowDefinitionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Workflow definition with this combination already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createWorkflowDefinitionDto: CreateWorkflowDefinitionDto) {
    return this.workflowDefinitionsService.create(createWorkflowDefinitionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all workflow definitions',
    description: 'Retrieves a paginated list of all workflow definitions',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of workflow definitions.',
    type: [WorkflowDefinitionResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.workflowDefinitionsService.findAll(skip, limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search workflow definitions',
    description: 'Search workflow definitions by name, code, or description',
  })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns matching workflow definitions.',
    type: [WorkflowDefinitionResponseDto],
  })
  search(@Query('q') query: string) {
    return this.workflowDefinitionsService.search(query);
  }

  @Get('rail/:railId')
  @ApiOperation({
    summary: 'Get workflow definitions by rail ID',
    description: 'Retrieves all workflow definitions for a payment rail',
  })
  @ApiParam({ name: 'railId', description: 'Payment Rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns workflow definitions for the rail.',
    type: [WorkflowDefinitionResponseDto],
  })
  findByRailId(@Param('railId') railId: string) {
    return this.workflowDefinitionsService.findByRailId(railId);
  }

  @Get('code/:workflowCode')
  @ApiOperation({
    summary: 'Get workflow definitions by code',
    description: 'Retrieves workflow definitions by workflow code',
  })
  @ApiParam({ name: 'workflowCode', description: 'Workflow code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns workflow definitions.',
    type: [WorkflowDefinitionResponseDto],
  })
  findByCode(@Param('workflowCode') workflowCode: string) {
    return this.workflowDefinitionsService.findByCode(workflowCode);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get workflow definition by ID',
    description: 'Retrieves a single workflow definition by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Workflow Definition UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the workflow definition.',
    type: WorkflowDefinitionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workflow definition not found.',
  })
  findOne(@Param('id') id: string) {
    return this.workflowDefinitionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a workflow definition',
    description: 'Updates an existing workflow definition',
  })
  @ApiParam({ name: 'id', description: 'Workflow Definition UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The workflow definition has been successfully updated.',
    type: WorkflowDefinitionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workflow definition not found.',
  })
  update(@Param('id') id: string, @Body() updateWorkflowDefinitionDto: UpdateWorkflowDefinitionDto) {
    return this.workflowDefinitionsService.update(id, updateWorkflowDefinitionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a workflow definition',
    description: 'Deletes a workflow definition by ID',
  })
  @ApiParam({ name: 'id', description: 'Workflow Definition UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The workflow definition has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Workflow definition not found.',
  })
  remove(@Param('id') id: string) {
    return this.workflowDefinitionsService.remove(id);
  }
}
