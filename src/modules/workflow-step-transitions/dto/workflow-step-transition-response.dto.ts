import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class WorkflowStepTransitionResponseDto {
  @ApiProperty({
    description: 'Workflow Step Transition ID',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Workflow Definition ID',
    example: '550e8400-e29b-41d4-a716-446655440001',
  })
  workflowId: string;

  @ApiPropertyOptional({
    description: 'From Step ID',
  })
  fromStepId?: string;

  @ApiPropertyOptional({
    description: 'To Step ID',
  })
  toStepId?: string;

  @ApiProperty({
    description: 'Transition trigger status',
    example: 'SUCCESS',
  })
  transitionTrigger: string;

  @ApiPropertyOptional({
    description: 'Condition expression',
  })
  conditionExpression?: string;

  @ApiProperty({
    description: 'Priority',
    example: 1,
  })
  priority: number;

  @ApiProperty({
    description: 'Is transition active',
    example: true,
  })
  isActive: boolean;

  @ApiPropertyOptional({
    description: 'Additional metadata',
  })
  metadata?: any;

  @ApiProperty({
    description: 'Created timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Updated timestamp',
    example: '2024-01-01T00:00:00.000Z',
  })
  updatedAt: Date;
}
