import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, Max, Min } from 'class-validator';
import { DIAGNOSIS_DEFAULTS } from '../diagnosis-engine';

export class StartSessionDto {
  @ApiProperty({
    description: 'Self-declared maturity level (1..maxLevel).',
    example: 3,
    minimum: 1,
    maximum: DIAGNOSIS_DEFAULTS.MAX_LEVEL,
  })
  @IsInt()
  @IsPositive()
  @Min(1)
  @Max(DIAGNOSIS_DEFAULTS.MAX_LEVEL)
  declared_level: number;
}
