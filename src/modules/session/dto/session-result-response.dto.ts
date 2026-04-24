import { ApiProperty } from '@nestjs/swagger';
import { AnswerEntity } from '../answer.entity';
import { SessionEntity } from '../session.entity';

export class TrajectoryEventResponse {
  @ApiProperty({ example: 1 })
  step: number;

  @ApiProperty({ example: 2 })
  tested_level: number;

  @ApiProperty({ example: 7 })
  question_id: number;

  @ApiProperty({ example: 'yes' })
  value: string;

  @ApiProperty({ example: true })
  passed: boolean;

  @ApiProperty({ example: 0 })
  floor_after: number;

  @ApiProperty({ example: 4 })
  ceiling_after: number;

  @ApiProperty({ example: '2026-04-20T12:34:56Z' })
  answered_at: Date;

  static fromEntity(entity: AnswerEntity): TrajectoryEventResponse {
    const r = new TrajectoryEventResponse();
    r.step = entity.step;
    r.tested_level = entity.tested_level;
    r.question_id = entity.question_id;
    r.value = entity.value;
    r.passed = entity.passed;
    r.floor_after = entity.floor_after;
    r.ceiling_after = entity.ceiling_after;
    r.answered_at = entity.answered_at;
    return r;
  }
}

export class SessionResultResponse {
  @ApiProperty({ example: 'b8c1e6d2-1f2a-4c0a-9b3e-6e0f2b5a0001' })
  session_id: string;

  @ApiProperty({ example: 3 })
  declared_level: number;

  @ApiProperty({ example: 2, nullable: true })
  final_level: number | null;

  @ApiProperty({ example: 'completed' })
  status: string;

  @ApiProperty({ example: 10 })
  total_answers: number;

  @ApiProperty({ type: [TrajectoryEventResponse] })
  trajectory: TrajectoryEventResponse[];

  static fromEntity(
    session: SessionEntity,
    answers: AnswerEntity[],
  ): SessionResultResponse {
    const response = new SessionResultResponse();
    response.session_id = session.id;
    response.declared_level = session.declared_level;
    response.final_level = session.final_level;
    response.status = session.status;
    response.total_answers = answers.length;
    response.trajectory = answers.map((a) =>
      TrajectoryEventResponse.fromEntity(a),
    );
    return response;
  }
}
