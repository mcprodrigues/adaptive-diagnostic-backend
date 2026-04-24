import { ApiProperty } from '@nestjs/swagger';
import { QuestionEntity, QuestionOption } from '../question.entity';
import { QuestionType } from '../enums/question-type.enum';

export class QuestionOptionResponse {
  @ApiProperty({ example: 'yes' })
  value: string;

  @ApiProperty({ example: 'Sim' })
  label: string;

  @ApiProperty({ example: true })
  passes: boolean;
}

export class QuestionResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  level_index: number;

  @ApiProperty({ example: 'Você tem um MVP em produção?' })
  text: string;

  @ApiProperty({ enum: QuestionType, example: QuestionType.BOOLEAN })
  question_type: QuestionType;

  @ApiProperty({ example: 3 })
  order_in_level: number;

  @ApiProperty({ type: [QuestionOptionResponse] })
  options: QuestionOption[];

  static fromEntity(entity: QuestionEntity): QuestionResponse {
    const r = new QuestionResponse();
    r.id = entity.id;
    r.level_index = entity.level?.level_index ?? 0;
    r.text = entity.text;
    r.question_type = entity.question_type;
    r.order_in_level = entity.order_in_level;
    r.options = entity.options;
    return r;
  }
}
