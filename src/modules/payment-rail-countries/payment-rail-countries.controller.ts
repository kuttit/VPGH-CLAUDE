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
import { PaymentRailCountriesService } from './payment-rail-countries.service';
import { CreatePaymentRailCountryDto } from './dto/create-payment-rail-country.dto';
import { UpdatePaymentRailCountryDto } from './dto/update-payment-rail-country.dto';
import { PaymentRailCountryResponseDto } from './dto/payment-rail-country-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Payment Rail Countries')
@Controller('payment-rail-countries')
export class PaymentRailCountriesController {
  constructor(private readonly paymentRailCountriesService: PaymentRailCountriesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment rail country association',
    description: 'Associates a country with a payment rail',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The association has been successfully created.',
    type: PaymentRailCountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'This rail-country combination already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createPaymentRailCountryDto: CreatePaymentRailCountryDto) {
    return this.paymentRailCountriesService.create(createPaymentRailCountryDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payment rail country associations',
    description: 'Retrieves a paginated list of all payment rail country associations',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of associations.',
    type: [PaymentRailCountryResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.paymentRailCountriesService.findAll(skip, limit);
  }

  @Get('rail/:railId')
  @ApiOperation({
    summary: 'Get countries by rail ID',
    description: 'Retrieves all countries associated with a payment rail',
  })
  @ApiParam({ name: 'railId', description: 'Payment Rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns countries for the rail.',
    type: [PaymentRailCountryResponseDto],
  })
  findByRailId(@Param('railId') railId: string) {
    return this.paymentRailCountriesService.findByRailId(railId);
  }

  @Get('country/:countryId')
  @ApiOperation({
    summary: 'Get rails by country ID',
    description: 'Retrieves all payment rails available in a country',
  })
  @ApiParam({ name: 'countryId', description: 'Country UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns rails for the country.',
    type: [PaymentRailCountryResponseDto],
  })
  findByCountryId(@Param('countryId') countryId: string) {
    return this.paymentRailCountriesService.findByCountryId(countryId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get payment rail country by ID',
    description: 'Retrieves a single association by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Payment Rail Country UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the association.',
    type: PaymentRailCountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  findOne(@Param('id') id: string) {
    return this.paymentRailCountriesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a payment rail country association',
    description: 'Updates an existing association',
  })
  @ApiParam({ name: 'id', description: 'Payment Rail Country UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The association has been successfully updated.',
    type: PaymentRailCountryResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  update(@Param('id') id: string, @Body() updatePaymentRailCountryDto: UpdatePaymentRailCountryDto) {
    return this.paymentRailCountriesService.update(id, updatePaymentRailCountryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a payment rail country association',
    description: 'Deletes an association by ID',
  })
  @ApiParam({ name: 'id', description: 'Payment Rail Country UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The association has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  remove(@Param('id') id: string) {
    return this.paymentRailCountriesService.remove(id);
  }
}
