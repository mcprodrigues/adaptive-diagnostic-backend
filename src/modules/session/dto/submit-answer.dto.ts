import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsPositive, IsString, MinLength } from 'class-validator';

export class SubmitAnswerDto {
  @ApiProperty({
    description: 'ID of the question being answered.',
    example: 7,
  })
  @IsInt()
  @IsPositive()
  question_id: number;

  @ApiProperty({
    description: 'Value chosen from the question options.',
    example: 'yes',
  })
  @IsString()
  @MinLength(1)
  value: string;
}
