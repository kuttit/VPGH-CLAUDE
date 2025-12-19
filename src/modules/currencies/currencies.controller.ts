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
import { CurrenciesService } from './currencies.service';
import { CreateCurrencyDto } from './dto/create-currency.dto';
import { UpdateCurrencyDto } from './dto/update-currency.dto';
import { CurrencyResponseDto } from './dto/currency-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Currencies')
@Controller('currencies')
export class CurrenciesController {
  constructor(private readonly currenciesService: CurrenciesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new currency',
    description: 'Creates a new currency master record',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The currency has been successfully created.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Currency with this code already exists.',
  })
  create(@Body() createCurrencyDto: CreateCurrencyDto) {
    return this.currenciesService.create(createCurrencyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all currencies',
    description: 'Retrieves a paginated list of all currencies',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of currencies.',
    type: [CurrencyResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.currenciesService.findAll(skip, limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search currencies',
    description: 'Search currencies by name or code',
  })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns matching currencies.',
    type: [CurrencyResponseDto],
  })
  search(@Query('q') query: string) {
    return this.currenciesService.search(query);
  }

  @Get('code/:code')
  @ApiOperation({
    summary: 'Get currency by code',
    description: 'Retrieves a currency by its ISO 4217 code',
  })
  @ApiParam({ name: 'code', description: 'Currency code (ISO 4217)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the currency.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Currency not found.',
  })
  findByCode(@Param('code') code: string) {
    return this.currenciesService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get currency by ID',
    description: 'Retrieves a single currency by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Currency UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the currency.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Currency not found.',
  })
  findOne(@Param('id') id: string) {
    return this.currenciesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a currency',
    description: 'Updates an existing currency',
  })
  @ApiParam({ name: 'id', description: 'Currency UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The currency has been successfully updated.',
    type: CurrencyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Currency not found.',
  })
  update(@Param('id') id: string, @Body() updateCurrencyDto: UpdateCurrencyDto) {
    return this.currenciesService.update(id, updateCurrencyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a currency',
    description: 'Deletes a currency by ID',
  })
  @ApiParam({ name: 'id', description: 'Currency UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The currency has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Currency not found.',
  })
  remove(@Param('id') id: string) {
    return this.currenciesService.remove(id);
  }
}
