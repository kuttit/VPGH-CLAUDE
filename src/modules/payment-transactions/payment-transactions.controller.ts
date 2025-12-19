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
import { PaymentTransactionsService } from './payment-transactions.service';
import { CreatePaymentTransactionDto, TransactionStatus } from './dto/create-payment-transaction.dto';
import { UpdatePaymentTransactionDto } from './dto/update-payment-transaction.dto';
import { PaymentTransactionResponseDto } from './dto/payment-transaction-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Payment Transactions')
@Controller('payment-transactions')
export class PaymentTransactionsController {
  constructor(
    private readonly paymentTransactionsService: PaymentTransactionsService,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new payment transaction',
    description: 'Initiates a new payment transaction',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The payment transaction has been successfully created.',
    type: PaymentTransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid transaction data.',
  })
  create(@Body() createPaymentTransactionDto: CreatePaymentTransactionDto) {
    return this.paymentTransactionsService.create(createPaymentTransactionDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all payment transactions',
    description: 'Retrieves a paginated list of payment transactions',
  })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: TransactionStatus, description: 'Filter by transaction status' })
  @ApiQuery({ name: 'railId', required: false, type: String, description: 'Filter by payment rail' })
  @ApiQuery({ name: 'direction', required: false, type: String, description: 'Filter by direction' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of payment transactions.',
    type: [PaymentTransactionResponseDto],
  })
  async findAll(
    @Query() pagination: PaginationDto,
    @Query('status') status?: TransactionStatus,
    @Query('railId') railId?: string,
    @Query('direction') direction?: string,
  ) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.paymentTransactionsService.findAll(skip, limit, status, railId, direction);
  }

  @Get('suspicious')
  @ApiOperation({
    summary: 'Get suspicious transactions',
    description: 'Retrieves all transactions marked as suspicious',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns suspicious transactions.',
    type: [PaymentTransactionResponseDto],
  })
  findSuspicious() {
    return this.paymentTransactionsService.findSuspicious();
  }

  @Get('requiring-hitl')
  @ApiOperation({
    summary: 'Get transactions requiring HITL',
    description: 'Retrieves all transactions requiring human in the loop intervention',
  })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns transactions requiring HITL.',
    type: [PaymentTransactionResponseDto],
  })
  findRequiringHitl() {
    return this.paymentTransactionsService.findRequiringHitl();
  }

  @Get('ref/:transactionRef')
  @ApiOperation({
    summary: 'Get transaction by reference',
    description: 'Retrieves a transaction by its unique reference',
  })
  @ApiParam({ name: 'transactionRef', description: 'Transaction reference' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the payment transaction.',
    type: PaymentTransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found.',
  })
  findByRef(@Param('transactionRef') transactionRef: string) {
    return this.paymentTransactionsService.findByRef(transactionRef);
  }

  @Get(':id/journey')
  @ApiOperation({
    summary: 'Get transaction journey',
    description: 'Retrieves the complete processing journey of a transaction',
  })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the transaction journey with all process logs.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found.',
  })
  getTransactionJourney(@Param('id') id: string) {
    return this.paymentTransactionsService.getTransactionJourney(id);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction by ID',
    description: 'Retrieves a single payment transaction by its UUID with complete details',
  })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the payment transaction with all related data.',
    type: PaymentTransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found.',
  })
  findOne(@Param('id') id: string) {
    return this.paymentTransactionsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a payment transaction',
    description: 'Updates an existing payment transaction',
  })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The payment transaction has been successfully updated.',
    type: PaymentTransactionResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found.',
  })
  update(
    @Param('id') id: string,
    @Body() updatePaymentTransactionDto: UpdatePaymentTransactionDto,
  ) {
    return this.paymentTransactionsService.update(id, updatePaymentTransactionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a payment transaction',
    description: 'Deletes a payment transaction by ID',
  })
  @ApiParam({ name: 'id', description: 'Transaction UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The payment transaction has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction not found.',
  })
  remove(@Param('id') id: string) {
    return this.paymentTransactionsService.remove(id);
  }
}
