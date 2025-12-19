import { Controller, Get, Post, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { AuditTrailsService } from './audit-trails.service';
import { CreateAuditTrailDto } from './dto/create-audit-trail.dto';
import { AuditTrailResponseDto } from './dto/audit-trail-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Audit Trails')
@Controller('audit-trails')
export class AuditTrailsController {
  constructor(private readonly service: AuditTrailsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new audit trail entry' })
  @ApiResponse({ status: HttpStatus.CREATED, type: AuditTrailResponseDto })
  create(@Body() createDto: CreateAuditTrailDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all audit trails' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [AuditTrailResponseDto] })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.service.findAll((page - 1) * limit, limit);
  }

  @Get('table/:tableName')
  @ApiOperation({ summary: 'Get audit trails by table name' })
  @ApiParam({ name: 'tableName', description: 'Table name' })
  @ApiResponse({ status: HttpStatus.OK, type: [AuditTrailResponseDto] })
  findByTableName(@Param('tableName') tableName: string) {
    return this.service.findByTableName(tableName);
  }

  @Get('record/:recordId')
  @ApiOperation({ summary: 'Get audit trails by record ID' })
  @ApiParam({ name: 'recordId', description: 'Record UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: [AuditTrailResponseDto] })
  findByRecordId(@Param('recordId') recordId: string) {
    return this.service.findByRecordId(recordId);
  }

  @Get('user/:changedBy')
  @ApiOperation({ summary: 'Get audit trails by user' })
  @ApiParam({ name: 'changedBy', description: 'Username' })
  @ApiResponse({ status: HttpStatus.OK, type: [AuditTrailResponseDto] })
  findByChangedBy(@Param('changedBy') changedBy: string) {
    return this.service.findByChangedBy(changedBy);
  }

  @Get('action/:action')
  @ApiOperation({ summary: 'Get audit trails by action' })
  @ApiParam({ name: 'action', description: 'Action (CREATE, UPDATE, DELETE)' })
  @ApiResponse({ status: HttpStatus.OK, type: [AuditTrailResponseDto] })
  findByAction(@Param('action') action: string) {
    return this.service.findByAction(action);
  }

  @Get('correlation/:correlationId')
  @ApiOperation({ summary: 'Get audit trails by correlation ID' })
  @ApiParam({ name: 'correlationId', description: 'Correlation ID' })
  @ApiResponse({ status: HttpStatus.OK, type: [AuditTrailResponseDto] })
  findByCorrelationId(@Param('correlationId') correlationId: string) {
    return this.service.findByCorrelationId(correlationId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get audit trail by ID' })
  @ApiParam({ name: 'id', description: 'Audit Trail UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: AuditTrailResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
