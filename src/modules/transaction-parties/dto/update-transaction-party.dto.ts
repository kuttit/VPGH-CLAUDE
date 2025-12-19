import { PartialType } from '@nestjs/swagger';
import { CreateTransactionPartyDto } from './create-transaction-party.dto';

export class UpdateTransactionPartyDto extends PartialType(CreateTransactionPartyDto) {}
