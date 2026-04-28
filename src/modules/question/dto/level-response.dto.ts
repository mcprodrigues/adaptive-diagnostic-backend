import { ApiProperty } from '@nestjs/swagger';
import { KthDimension, LevelEntity } from '../level.entity';

export class LevelResponse {
  @ApiProperty({ example: 1 })
  id: number;

  @ApiProperty({ enum: KthDimension, example: KthDimension.CRL })
  dimension: KthDimension;

  @ApiProperty({ example: 5 })
  level_index: number;

  @ApiProperty({ example: 'CRL 5 — Interesse e relacionamento estabelecidos' })
  name: string;

  @ApiProperty({
    example:
      'Interesse estabelecido pelo produto e relacionamento com clientes-alvo.',
  })
  description: string;

  static fromEntity(entity: LevelEntity): LevelResponse {
    const r = new LevelResponse();
    r.id = entity.id;
    r.dimension = entity.dimension;
    r.level_index = entity.level_index;
    r.name = entity.name;
    r.description = entity.description;
    return r;
  }
}
