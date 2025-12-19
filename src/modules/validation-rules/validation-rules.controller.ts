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
import { ValidationRulesService } from './validation-rules.service';
import { CreateValidationRuleDto } from './dto/create-validation-rule.dto';
import { UpdateValidationRuleDto } from './dto/update-validation-rule.dto';
import { ValidationRuleResponseDto } from './dto/validation-rule-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Validation Rules')
@Controller('validation-rules')
export class ValidationRulesController {
  constructor(private readonly service: ValidationRulesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new validation rule',
    description: 'Creates a new validation rule for payment processing',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The validation rule has been successfully created.',
    type: ValidationRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createDto: CreateValidationRuleDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all validation rules',
    description: 'Retrieves a paginated list of all validation rules',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of validation rules.',
    type: [ValidationRuleResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.service.findAll(skip, limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search validation rules',
    description: 'Search validation rules by name, code, or description',
  })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns matching validation rules.',
    type: [ValidationRuleResponseDto],
  })
  search(@Query('q') query: string) {
    return this.service.search(query);
  }

  @Get('rail/:railId')
  @ApiOperation({
    summary: 'Get validation rules by rail ID',
    description: 'Retrieves all validation rules for a payment rail',
  })
  @ApiParam({ name: 'railId', description: 'Payment Rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns validation rules for the rail.',
    type: [ValidationRuleResponseDto],
  })
  findByRailId(@Param('railId') railId: string) {
    return this.service.findByRailId(railId);
  }

  @Get('category/:category')
  @ApiOperation({
    summary: 'Get validation rules by category',
    description: 'Retrieves all validation rules of a specific category',
  })
  @ApiParam({ name: 'category', description: 'Rule category' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns validation rules of the category.',
    type: [ValidationRuleResponseDto],
  })
  findByCategory(@Param('category') category: string) {
    return this.service.findByCategory(category);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get validation rule by ID',
    description: 'Retrieves a single validation rule by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Validation Rule UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the validation rule.',
    type: ValidationRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Validation rule not found.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a validation rule',
    description: 'Updates an existing validation rule',
  })
  @ApiParam({ name: 'id', description: 'Validation Rule UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The validation rule has been successfully updated.',
    type: ValidationRuleResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Validation rule not found.',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateValidationRuleDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a validation rule',
    description: 'Deletes a validation rule by ID',
  })
  @ApiParam({ name: 'id', description: 'Validation Rule UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The validation rule has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Validation rule not found.',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
