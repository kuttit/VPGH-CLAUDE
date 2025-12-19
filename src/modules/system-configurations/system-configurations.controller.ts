import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { SystemConfigurationsService } from './system-configurations.service';
import { CreateSystemConfigurationDto } from './dto/create-system-configuration.dto';
import { UpdateSystemConfigurationDto } from './dto/update-system-configuration.dto';
import { SystemConfigurationResponseDto } from './dto/system-configuration-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('System Configurations')
@Controller('system-configurations')
export class SystemConfigurationsController {
  constructor(private readonly service: SystemConfigurationsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new system configuration' })
  @ApiResponse({ status: HttpStatus.CREATED, type: SystemConfigurationResponseDto })
  @ApiResponse({ status: HttpStatus.CONFLICT, description: 'Configuration key already exists' })
  create(@Body() createDto: CreateSystemConfigurationDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all system configurations' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [SystemConfigurationResponseDto] })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.service.findAll((page - 1) * limit, limit);
  }

  @Get('key/:configKey')
  @ApiOperation({ summary: 'Get configuration by key' })
  @ApiParam({ name: 'configKey', description: 'Configuration key' })
  @ApiResponse({ status: HttpStatus.OK, type: SystemConfigurationResponseDto })
  findByKey(@Param('configKey') configKey: string) {
    return this.service.findByKey(configKey);
  }

  @Get('category/:category')
  @ApiOperation({ summary: 'Get configurations by category' })
  @ApiParam({ name: 'category', description: 'Category name' })
  @ApiResponse({ status: HttpStatus.OK, type: [SystemConfigurationResponseDto] })
  findByCategory(@Param('category') category: string) {
    return this.service.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get system configuration by ID' })
  @ApiParam({ name: 'id', description: 'Configuration UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: SystemConfigurationResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a system configuration' })
  @ApiParam({ name: 'id', description: 'Configuration UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: SystemConfigurationResponseDto })
  update(@Param('id') id: string, @Body() updateDto: UpdateSystemConfigurationDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a system configuration' })
  @ApiParam({ name: 'id', description: 'Configuration UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
