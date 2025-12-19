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
import { PaymentRailCurrenciesService } from './payment-rail-currencies.service';
import { CreatePaymentRailCurrencyDto } from './dto/create-payment-rail-currency.dto';
import { UpdatePaymentRailCurrencyDto } from './dto/update-payment-rail-currency.dto';
import { PaymentRailCurrencyResponseDto } from './dto/payment-rail-currency-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Payment Rail Currencies')
@Controller('payment-rail-currencies')
export class PaymentRailCurrenciesController {
  constructor(private readonly paymentRailCurrenciesService: PaymentRailCurrenciesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment rail currency association',
    description: 'Associates a currency with a payment rail',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The association has been successfully created.',
    type: PaymentRailCurrencyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'This rail-currency combination already exists.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createPaymentRailCurrencyDto: CreatePaymentRailCurrencyDto) {
    return this.paymentRailCurrenciesService.create(createPaymentRailCurrencyDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payment rail currency associations',
    description: 'Retrieves a paginated list of all payment rail currency associations',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of associations.',
    type: [PaymentRailCurrencyResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.paymentRailCurrenciesService.findAll(skip, limit);
  }

  @Get('rail/:railId')
  @ApiOperation({
    summary: 'Get currencies by rail ID',
    description: 'Retrieves all currencies associated with a payment rail',
  })
  @ApiParam({ name: 'railId', description: 'Payment Rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns currencies for the rail.',
    type: [PaymentRailCurrencyResponseDto],
  })
  findByRailId(@Param('railId') railId: string) {
    return this.paymentRailCurrenciesService.findByRailId(railId);
  }

  @Get('currency/:currencyId')
  @ApiOperation({
    summary: 'Get rails by currency ID',
    description: 'Retrieves all payment rails that support a currency',
  })
  @ApiParam({ name: 'currencyId', description: 'Currency UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns rails for the currency.',
    type: [PaymentRailCurrencyResponseDto],
  })
  findByCurrencyId(@Param('currencyId') currencyId: string) {
    return this.paymentRailCurrenciesService.findByCurrencyId(currencyId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get payment rail currency by ID',
    description: 'Retrieves a single association by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Payment Rail Currency UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the association.',
    type: PaymentRailCurrencyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  findOne(@Param('id') id: string) {
    return this.paymentRailCurrenciesService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a payment rail currency association',
    description: 'Updates an existing association',
  })
  @ApiParam({ name: 'id', description: 'Payment Rail Currency UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The association has been successfully updated.',
    type: PaymentRailCurrencyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  update(@Param('id') id: string, @Body() updatePaymentRailCurrencyDto: UpdatePaymentRailCurrencyDto) {
    return this.paymentRailCurrenciesService.update(id, updatePaymentRailCurrencyDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a payment rail currency association',
    description: 'Deletes an association by ID',
  })
  @ApiParam({ name: 'id', description: 'Payment Rail Currency UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The association has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Association not found.',
  })
  remove(@Param('id') id: string) {
    return this.paymentRailCurrenciesService.remove(id);
  }
}
