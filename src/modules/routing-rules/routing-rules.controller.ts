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
import { RoutingRulesService } from './routing-rules.service';
import { CreateRoutingRuleDto } from './dto/create-routing-rule.dto';
import { UpdateRoutingRuleDto } from './dto/update-routing-rule.dto';
import { RoutingRuleResponseDto } from './dto/routing-rule-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Routing Rules')
@Controller('routing-rules')
export class RoutingRulesController {
  constructor(private readonly service: RoutingRulesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new routing rule',
    description: 'Creates a new routing rule for payment routing decisions',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The routing rule has been successfully created.',
    type: RoutingRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Routing rule with this code already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createDto: CreateRoutingRuleDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all routing rules',
    description: 'Retrieves a paginated list of all routing rules',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of routing rules.',
    type: [RoutingRuleResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.service.findAll(skip, limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search routing rules',
    description: 'Search routing rules by name, code, or description',
  })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns matching routing rules.',
    type: [RoutingRuleResponseDto],
  })
  search(@Query('q') query: string) {
    return this.service.search(query);
  }

  @Get('code/:ruleCode')
  @ApiOperation({
    summary: 'Get routing rule by code',
    description: 'Retrieves a routing rule by its code',
  })
  @ApiParam({ name: 'ruleCode', description: 'Rule code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the routing rule.',
    type: RoutingRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Routing rule not found.',
  })
  findByCode(@Param('ruleCode') ruleCode: string) {
    return this.service.findByCode(ruleCode);
  }

  @Get('rail/:railId')
  @ApiOperation({
    summary: 'Get routing rules by target rail ID',
    description: 'Retrieves all routing rules for a target payment rail',
  })
  @ApiParam({ name: 'railId', description: 'Target Payment Rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns routing rules for the rail.',
    type: [RoutingRuleResponseDto],
  })
  findByTargetRailId(@Param('railId') railId: string) {
    return this.service.findByTargetRailId(railId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get routing rule by ID',
    description: 'Retrieves a single routing rule by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Routing Rule UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the routing rule.',
    type: RoutingRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Routing rule not found.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a routing rule',
    description: 'Updates an existing routing rule',
  })
  @ApiParam({ name: 'id', description: 'Routing Rule UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The routing rule has been successfully updated.',
    type: RoutingRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Routing rule not found.',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateRoutingRuleDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a routing rule',
    description: 'Deletes a routing rule by ID',
  })
  @ApiParam({ name: 'id', description: 'Routing Rule UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The routing rule has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Routing rule not found.',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
