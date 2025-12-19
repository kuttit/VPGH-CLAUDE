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
import { PaymentProductsService } from './payment-products.service';
import { CreatePaymentProductDto } from './dto/create-payment-product.dto';
import { UpdatePaymentProductDto } from './dto/update-payment-product.dto';
import { PaymentProductResponseDto } from './dto/payment-product-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Payment Products')
@Controller('payment-products')
export class PaymentProductsController {
  constructor(private readonly paymentProductsService: PaymentProductsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment product',
    description: 'Creates a new payment product for a specific rail',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The payment product has been successfully created.',
    type: PaymentProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Payment product with this code already exists for the rail.',
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createPaymentProductDto: CreatePaymentProductDto) {
    return this.paymentProductsService.create(createPaymentProductDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payment products',
    description: 'Retrieves a paginated list of all payment products',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of payment products.',
    type: [PaymentProductResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.paymentProductsService.findAll(skip, limit);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search payment products',
    description: 'Search payment products by name, code, or description',
  })
  @ApiQuery({ name: 'q', required: true, type: String, description: 'Search query' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns matching payment products.',
    type: [PaymentProductResponseDto],
  })
  search(@Query('q') query: string) {
    return this.paymentProductsService.search(query);
  }

  @Get('rail/:railId')
  @ApiOperation({
    summary: 'Get payment products by rail ID',
    description: 'Retrieves all payment products for a specific payment rail',
  })
  @ApiParam({ name: 'railId', description: 'Payment Rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns payment products for the rail.',
    type: [PaymentProductResponseDto],
  })
  findByRailId(@Param('railId') railId: string) {
    return this.paymentProductsService.findByRailId(railId);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get payment product by ID',
    description: 'Retrieves a single payment product by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Payment Product UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the payment product.',
    type: PaymentProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment product not found.',
  })
  findOne(@Param('id') id: string) {
    return this.paymentProductsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a payment product',
    description: 'Updates an existing payment product',
  })
  @ApiParam({ name: 'id', description: 'Payment Product UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The payment product has been successfully updated.',
    type: PaymentProductResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment product not found.',
  })
  update(@Param('id') id: string, @Body() updatePaymentProductDto: UpdatePaymentProductDto) {
    return this.paymentProductsService.update(id, updatePaymentProductDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a payment product',
    description: 'Deletes a payment product by ID',
  })
  @ApiParam({ name: 'id', description: 'Payment Product UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The payment product has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment product not found.',
  })
  remove(@Param('id') id: string) {
    return this.paymentProductsService.remove(id);
  }
}
