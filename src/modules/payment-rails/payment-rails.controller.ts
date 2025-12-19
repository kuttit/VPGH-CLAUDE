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
import { PaymentRailsService } from './payment-rails.service';
import { CreatePaymentRailDto } from './dto/create-payment-rail.dto';
import { UpdatePaymentRailDto } from './dto/update-payment-rail.dto';
import { PaymentRailResponseDto } from './dto/payment-rail-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Payment Rails')
@Controller('payment-rails')
export class PaymentRailsController {
  constructor(private readonly paymentRailsService: PaymentRailsService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment rail',
    description: 'Creates a new payment rail configuration',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The payment rail has been successfully created.',
    type: PaymentRailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.CONFLICT,
    description: 'Payment rail with this code already exists.',
  })
  create(@Body() createPaymentRailDto: CreatePaymentRailDto) {
    return this.paymentRailsService.create(createPaymentRailDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payment rails',
    description: 'Retrieves a paginated list of all payment rails',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isActive', required: false, type: Boolean, description: 'Filter by active status' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of payment rails.',
    type: [PaymentRailResponseDto],
  })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('isActive') isActive?: string,
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    const activeFilter = isActive !== undefined ? isActive === 'true' : undefined;
    return this.paymentRailsService.findAll(skip, limit, activeFilter);
  }

  @Get('search')
  @ApiOperation({
    summary: 'Search payment rails',
    description: 'Search payment rails by name, code, or type',
  })
  @ApiQuery({ name: 'q', required: true, type: String })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns matching payment rails.',
    type: [PaymentRailResponseDto],
  })
  search(@Query('q') query: string) {
    return this.paymentRailsService.search(query);
  }

  @Get('type/:railType')
  @ApiOperation({
    summary: 'Get payment rails by type',
    description: 'Retrieves all payment rails of a specific type',
  })
  @ApiParam({ name: 'railType', description: 'Rail type (REAL_TIME, BATCH, WIRE)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns payment rails of the specified type.',
    type: [PaymentRailResponseDto],
  })
  findByType(@Param('railType') railType: string) {
    return this.paymentRailsService.findByType(railType);
  }

  @Get('code/:code')
  @ApiOperation({
    summary: 'Get payment rail by code',
    description: 'Retrieves a payment rail by its unique code',
  })
  @ApiParam({ name: 'code', description: 'Payment rail code' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the payment rail.',
    type: PaymentRailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment rail not found.',
  })
  findByCode(@Param('code') code: string) {
    return this.paymentRailsService.findByCode(code);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get payment rail by ID',
    description: 'Retrieves a single payment rail by its UUID with related data',
  })
  @ApiParam({ name: 'id', description: 'Payment rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the payment rail with products, countries, and currencies.',
    type: PaymentRailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment rail not found.',
  })
  findOne(@Param('id') id: string) {
    return this.paymentRailsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a payment rail',
    description: 'Updates an existing payment rail configuration',
  })
  @ApiParam({ name: 'id', description: 'Payment rail UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The payment rail has been successfully updated.',
    type: PaymentRailResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment rail not found.',
  })
  update(@Param('id') id: string, @Body() updatePaymentRailDto: UpdatePaymentRailDto) {
    return this.paymentRailsService.update(id, updatePaymentRailDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a payment rail',
    description: 'Deletes a payment rail by ID',
  })
  @ApiParam({ name: 'id', description: 'Payment rail UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The payment rail has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Payment rail not found.',
  })
  remove(@Param('id') id: string) {
    return this.paymentRailsService.remove(id);
  }
}
