import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentErrorLogsService } from './payment-error-logs.service';
import { CreatePaymentErrorLogDto } from './dto/create-payment-error-log.dto';
import { UpdatePaymentErrorLogDto } from './dto/update-payment-error-log.dto';
import { PaymentErrorLogResponseDto } from './dto/payment-error-log-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Payment Error Logs')
@Controller('payment-error-logs')
export class PaymentErrorLogsController {
  constructor(private readonly service: PaymentErrorLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment error log' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PaymentErrorLogResponseDto })
  create(@Body() createDto: CreatePaymentErrorLogDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment error logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [PaymentErrorLogResponseDto] })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.service.findAll((page - 1) * limit, limit);
  }

  @Get('unresolved')
  @ApiOperation({ summary: 'Get all unresolved error logs' })
  @ApiResponse({ status: HttpStatus.OK, type: [PaymentErrorLogResponseDto] })
  findUnresolved() {
    return this.service.findUnresolved();
  }

  @Get('transaction/:transactionId')
  @ApiOperation({ summary: 'Get error logs by transaction ID' })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: [PaymentErrorLogResponseDto] })
  findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.service.findByTransactionId(transactionId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment error log by ID' })
  @ApiParam({ name: 'id', description: 'Error Log UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: PaymentErrorLogResponseDto })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update a payment error log' })
  @ApiParam({ name: 'id', description: 'Error Log UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: PaymentErrorLogResponseDto })
  update(@Param('id') id: string, @Body() updateDto: UpdatePaymentErrorLogDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment error log' })
  @ApiParam({ name: 'id', description: 'Error Log UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
