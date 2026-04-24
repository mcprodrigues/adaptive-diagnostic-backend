import { ApiProperty } from '@nestjs/swagger';
import { LevelEntity } from '../level.entity';

export class LevelResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ example: 2 })
  level_index: number;

  @ApiProperty({ example: 'Ideação' })
  name: string;

  @ApiProperty({ example: 'Startup com hipótese de problema validada.' })
  description: string;

  static fromEntity(entity: LevelEntity): LevelResponse {
    const r = new LevelResponse();
    r.id = entity.id;
    r.level_index = entity.level_index;
    r.name = entity.name;
    r.description = entity.description;
    return r;
  }
}
