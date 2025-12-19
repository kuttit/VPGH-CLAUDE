import { Controller, Get, Post, Body, Param, Delete, Query, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';
import { PaymentProcessLogsService } from './payment-process-logs.service';
import { CreatePaymentProcessLogDto } from './dto/create-payment-process-log.dto';
import { PaymentProcessLogResponseDto } from './dto/payment-process-log-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Payment Process Logs')
@Controller('payment-process-logs')
export class PaymentProcessLogsController {
  constructor(private readonly service: PaymentProcessLogsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new payment process log' })
  @ApiResponse({ status: HttpStatus.CREATED, type: PaymentProcessLogResponseDto })
  create(@Body() createDto: CreatePaymentProcessLogDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all payment process logs' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: HttpStatus.OK, type: [PaymentProcessLogResponseDto] })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    return this.service.findAll((page - 1) * limit, limit);
  }

  @Get('transaction/:transactionId')
  @ApiOperation({ summary: 'Get logs by transaction ID' })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: [PaymentProcessLogResponseDto] })
  findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.service.findByTransactionId(transactionId);
  }

  @Get('event-type/:eventType')
  @ApiOperation({ summary: 'Get logs by event type' })
  @ApiParam({ name: 'eventType', description: 'Event type' })
  @ApiResponse({ status: HttpStatus.OK, type: [PaymentProcessLogResponseDto] })
  findByEventType(@Param('eventType') eventType: string) {
    return this.service.findByEventType(eventType);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get payment process log by ID' })
  @ApiParam({ name: 'id', description: 'Log UUID' })
  @ApiResponse({ status: HttpStatus.OK, type: PaymentProcessLogResponseDto })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Log not found' })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a payment process log' })
  @ApiParam({ name: 'id', description: 'Log UUID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Log not found' })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
