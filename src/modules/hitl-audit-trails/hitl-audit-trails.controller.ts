import { Controller, Get, Post, Body, Param, Query, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { HitlAuditTrailsService } from './hitl-audit-trails.service';
import { CreateHitlAuditTrailDto } from './dto/create-hitl-audit-trail.dto';
import { HitlAuditTrailResponseDto } from './dto/hitl-audit-trail-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('HITL Audit Trails')
@Controller('hitl-audit-trails')
export class HitlAuditTrailsController {
  constructor(private readonly service: HitlAuditTrailsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new HITL audit trail entry' })
  @ApiResponse({ status: HttpStatus.CREATED, type: HitlAuditTrailResponseDto })
  create(@Body() createDto: CreateHitlAuditTrailDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all HITL audit trails' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlAuditTrailResponseDto] })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.service.findAll((page - 1) * limit, limit);
  }

  @Get('intervention/:interventionId')
  @ApiOperation({ summary: 'Get audit trails by intervention ID' })
  @ApiParam({ name: 'interventionId', description: 'Intervention UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlAuditTrailResponseDto] })
  findByInterventionId(@Param('interventionId') interventionId: string) {
    return this.service.findByInterventionId(interventionId);
  }

  @Get('transaction/:transactionId')
  @ApiOperation({ summary: 'Get audit trails by transaction ID' })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlAuditTrailResponseDto] })
  findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.service.findByTransactionId(transactionId);
  }

  @Get('user/:actionBy')
  @ApiOperation({ summary: 'Get audit trails by user' })
  @ApiParam({ name: 'actionBy', description: 'Username' })
  @ApiResponse({ status: HttpStatus.OK, type: [HitlAuditTrailResponseDto] })
  findByActionBy(@Param('actionBy') actionBy: string) {
    return this.service.findByActionBy(actionBy);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get HITL audit trail by ID' })
  @ApiParam({ name: 'id', description: 'Audit Trail UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: HitlAuditTrailResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }
}
