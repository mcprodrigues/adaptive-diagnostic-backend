import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsPositive } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'ID of the affirmative being answered.',
    example: 7,
  })
  @IsInt()
  @IsPositive()
  question_id: number;

  @ApiProperty({
    description:
      'Whether the affirmative holds true for the startup ("yes" = true).',
    example: true,
  })
  @IsBoolean()
  passed: boolean;
}
