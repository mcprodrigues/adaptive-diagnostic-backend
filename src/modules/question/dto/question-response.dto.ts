import { ApiProperty } from '@nestjs/swagger';
import { QuestionEntity } from '../question.entity';

export class QuestionResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 5 })
  level_index: number;

  @ApiProperty({
    example: 'A startup identificou seu cliente-alvo.',
  })
  text: string;

  @ApiProperty({ example: 2 })
  order_in_level: number;

  static fromEntity(entity: QuestionEntity): QuestionResponse {
    const r = new QuestionResponse();
    r.id = entity.id;
    r.level_index = entity.level?.level_index ?? 0;
    r.text = entity.text;
    r.order_in_level = entity.order_in_level;
    return r;
  }
}
