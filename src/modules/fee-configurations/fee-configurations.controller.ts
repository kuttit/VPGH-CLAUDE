import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { FeeConfigurationsService } from './fee-configurations.service';
import { CreateFeeConfigurationDto } from './dto/create-fee-configuration.dto';
import { UpdateFeeConfigurationDto } from './dto/update-fee-configuration.dto';
import { FeeConfigurationResponseDto } from './dto/fee-configuration-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Fee Configurations')
@Controller('fee-configurations')
export class FeeConfigurationsController {
  constructor(private readonly service: FeeConfigurationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new fee configuration' })
  @ApiResponse({ status: HttpStatus.CREATED, type: FeeConfigurationResponseDto })
  create(@Body() createDto: CreateFeeConfigurationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all fee configurations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [FeeConfigurationResponseDto] })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.service.findAll((page - 1) * limit, limit);
  }

  @Get('rail/:railId')
  @ApiOperation({ summary: 'Get fee configurations by rail ID' })
  @ApiParam({ name: 'railId', description: 'Payment Rail UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: [FeeConfigurationResponseDto] })
  findByRailId(@Param('railId') railId: string) {
    return this.service.findByRailId(railId);
  }

  @Get('product/:productId')
  @ApiOperation({ summary: 'Get fee configurations by product ID' })
  @ApiParam({ name: 'productId', description: 'Payment Product UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: [FeeConfigurationResponseDto] })
  findByProductId(@Param('productId') productId: string) {
    return this.service.findByProductId(productId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get fee configuration by ID' })
  @ApiParam({ name: 'id', description: 'Fee Configuration UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: FeeConfigurationResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a fee configuration' })
  @ApiParam({ name: 'id', description: 'Fee Configuration UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: FeeConfigurationResponseDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateFeeConfigurationDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a fee configuration' })
  @ApiParam({ name: 'id', description: 'Fee Configuration UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
