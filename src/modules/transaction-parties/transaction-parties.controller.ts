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
import { TransactionPartiesService } from './transaction-parties.service';
import { CreateTransactionPartyDto } from './dto/create-transaction-party.dto';
import { UpdateTransactionPartyDto } from './dto/update-transaction-party.dto';
import { TransactionPartyResponseDto } from './dto/transaction-party-response.dto';
import { PaginationDto } from '../../common/dto/pagination.dto';

@ApiTags('Transaction Parties')
@Controller('transaction-parties')
export class TransactionPartiesController {
  constructor(private readonly service: TransactionPartiesService) {}

  @Post()
  @ApiOperation({
    summary: 'Create a new transaction party',
    description: 'Creates a new party (debtor, creditor, etc.) for a transaction',
  })
  @ApiResponse({
    status: HttpStatus.CREATED,
    description: 'The transaction party has been successfully created.',
    type: TransactionPartyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Invalid input data.',
  })
  create(@Body() createDto: CreateTransactionPartyDto) {
    return this.service.create(createDto);
  }

  @Get()
  @ApiOperation({
    summary: 'Get all transaction parties',
    description: 'Retrieves a paginated list of all transaction parties',
  })
  @ApiQuery({ name: 'page', required: false, type: Number, description: 'Page number' })
  @ApiQuery({ name: 'limit', required: false, type: Number, description: 'Items per page' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns paginated list of transaction parties.',
    type: [TransactionPartyResponseDto],
  })
  async findAll(@Query() pagination: PaginationDto) {
    const { page = 1, limit = 10 } = pagination;
    const skip = (page - 1) * limit;
    return this.service.findAll(skip, limit);
  }

  @Get('transaction/:transactionId')
  @ApiOperation({
    summary: 'Get parties by transaction ID',
    description: 'Retrieves all parties for a specific transaction',
  })
  @ApiParam({ name: 'transactionId', description: 'Transaction UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns parties for the transaction.',
    type: [TransactionPartyResponseDto],
  })
  findByTransactionId(@Param('transactionId') transactionId: string) {
    return this.service.findByTransactionId(transactionId);
  }

  @Get('type/:partyType')
  @ApiOperation({
    summary: 'Get parties by type',
    description: 'Retrieves parties of a specific type',
  })
  @ApiParam({ name: 'partyType', description: 'Party type (DEBTOR, CREDITOR, etc.)' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns parties of the specified type.',
    type: [TransactionPartyResponseDto],
  })
  findByPartyType(@Param('partyType') partyType: string) {
    return this.service.findByPartyType(partyType);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get transaction party by ID',
    description: 'Retrieves a single transaction party by its UUID',
  })
  @ApiParam({ name: 'id', description: 'Transaction Party UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Returns the transaction party.',
    type: TransactionPartyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction party not found.',
  })
  findOne(@Param('id') id: string) {
    return this.service.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({
    summary: 'Update a transaction party',
    description: 'Updates an existing transaction party',
  })
  @ApiParam({ name: 'id', description: 'Transaction Party UUID' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'The transaction party has been successfully updated.',
    type: TransactionPartyResponseDto,
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction party not found.',
  })
  update(@Param('id') id: string, @Body() updateDto: UpdateTransactionPartyDto) {
    return this.service.update(id, updateDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({
    summary: 'Delete a transaction party',
    description: 'Deletes a transaction party by ID',
  })
  @ApiParam({ name: 'id', description: 'Transaction Party UUID' })
  @ApiResponse({
    status: HttpStatus.NO_CONTENT,
    description: 'The transaction party has been successfully deleted.',
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Transaction party not found.',
  })
  remove(@Param('id') id: string) {
    return this.service.remove(id);
  }
}
