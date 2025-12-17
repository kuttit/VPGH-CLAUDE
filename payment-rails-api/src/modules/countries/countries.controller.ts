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
import { CountriesService } from './countries.service';
import { CreateCountryDto } from './dto/create-country.dto';
import { UpdateCountryDto } from './dto/update-country.dto';
import { CountryResponseDto } from './dto/country-response.dto';
import { PaginationDto, PaginatedResponseDto } from '../../common/dto/pagination.dto';

@ApiTags('Countries')
@Controller('countries')
export class CountriesController {
  constructor(private readonly countriesService: CountriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new country',
    description: 'Creates a new country master record',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The country has been successfully created.',
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Country with this code already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createCountryDto: CreateCountryDto) {
    return this.countriesService.create(createCountryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all countries',
    description: 'Retrieves a paginated list of all countries',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of countries.',
    type: [CountryResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.countriesService.findAll(skip, limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search countries',
    description: 'Search countries by name or code',
  })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns matching countries.',
    type: [CountryResponseDto],
  })
  search(@Query('q') query: string) {
    return this.countriesService.search(query);
  }

  @Get('code/:code')
  @ApiOperation({
    summary: 'Get country by code',
    description: 'Retrieves a country by its ISO code',
  })
  @ApiParam({ name: 'code', description: 'Country code (ISO 3166-1 alpha-3)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the country.',
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found.',
  })
  findByCode(@Param('code') code: string) {
    return this.countriesService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get country by ID',
    description: 'Retrieves a single country by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Country UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the country.',
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found.',
  })
  findOne(@Param('id') id: string) {
    return this.countriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a country',
    description: 'Updates an existing country',
  })
  @ApiParam({ name: 'id', description: 'Country UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The country has been successfully updated.',
    type: CountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found.',
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Country with this code already exists.',
  })
  update(@Param('id') id: string, @Body() updateCountryDto: UpdateCountryDto) {
    return this.countriesService.update(id, updateCountryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a country',
    description: 'Deletes a country by ID',
  })
  @ApiParam({ name: 'id', description: 'Country UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The country has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Country not found.',
  })
  remove(@Param('id') id: string) {
    return this.countriesService.remove(id);
  }
}
