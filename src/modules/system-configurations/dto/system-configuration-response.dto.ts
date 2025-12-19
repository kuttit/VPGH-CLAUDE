import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class SystemConfigurationResponseDto {
  @ApiProperty({ description: 'Configuration ID' })
  id: string;

  @ApiProperty({ description: 'Configuration key' })
  configKey: string;

  @ApiProperty({ description: 'Configuration value' })
  configValue: string;

  @ApiProperty({ description: 'Configuration type' })
  configType: string;

  @ApiPropertyOptional({ description: 'Category' })
  category?: string;

  @ApiPropertyOptional({ description: 'Description' })
  description?: string;

  @ApiProperty({ description: 'Is sensitive' })
  isSensitive: boolean;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiPropertyOptional({ description: 'Effective from' })
  effectiveFrom?: Date;

  @ApiPropertyOptional({ description: 'Effective to' })
  effectiveTo?: Date;

  @ApiPropertyOptional({ description: 'Metadata' })
  metadata?: any;

  @ApiProperty({ description: 'Created timestamp' })
  createdAt: Date;

  @ApiProperty({ description: 'Updated timestamp' })
  updatedAt: Date;
}
