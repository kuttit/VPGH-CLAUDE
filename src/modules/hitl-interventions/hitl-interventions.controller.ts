import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { HitlInterventionsService } from './hitl-interventions.service';
import { CreateHitlInterventionDto } from './dto/create-hitl-intervention.dto';
import { UpdateHitlInterventionDto } from './dto/update-hitl-intervention.dto';
import { HitlInterventionResponseDto } from './dto/hitl-intervention-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('HITL Interventions')
@Controller('hitl-interventions')
export class HitlInterventionsController {
  constructor(private readonly service: HitlInterventionsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new HITL intervention' })
  @ApiResponse({ status: HttpStatus.CREATED, type: HitlInterventionResponseDto })
  create(@Body() createDto: CreateHitlInterventionDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all HITL interventions' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlInterventionResponseDto] })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.service.findAll((page - 1) * limit, limit);
  }

  @Get('active')
  @ApiOperation({ summary: 'Get all active HITL interventions' })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlInterventionResponseDto] })
  findActive() {
    return this.service.findActive();
  }

  @Get('queue/:queueName')
  @ApiOperation({ summary: 'Get interventions by queue' })
  @ApiParam({ name: 'queueName', description: 'Queue name' })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlInterventionResponseDto] })
  findByQueue(@Param('queueName') queueName: string) {
    return this.service.findByQueue(queueName);
  }

  @Get('assignee/:assignedTo')
  @ApiOperation({ summary: 'Get interventions by assignee' })
  @ApiParam({ name: 'assignedTo', description: 'Assignee username' })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlInterventionResponseDto] })
  findByAssignee(@Param('assignedTo') assignedTo: string) {
    return this.service.findByAssignee(assignedTo);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get HITL intervention by ID' })
  @ApiParam({ name: 'id', description: 'Intervention UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: HitlInterventionResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a HITL intervention' })
  @ApiParam({ name: 'id', description: 'Intervention UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: HitlInterventionResponseDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateHitlInterventionDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a HITL intervention' })
  @ApiParam({ name: 'id', description: 'Intervention UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
