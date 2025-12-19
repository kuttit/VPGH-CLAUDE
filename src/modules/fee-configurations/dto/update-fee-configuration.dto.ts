import { PartialType } from '@nestjs/swagger';
import { CreateFeeConfigurationDto } from './create-fee-configuration.dto';

export class UpdateFeeConfigurationDto extends PartialType(CreateFeeConfigurationDto) {}
