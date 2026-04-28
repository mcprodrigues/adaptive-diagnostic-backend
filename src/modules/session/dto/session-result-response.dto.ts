import { ApiProperty } from '@nestjs/swagger';
import { QuestionEntity } from 'src/modules/question/question.entity';
import { LevelEntity } from 'src/modules/question/level.entity';
import { AnswerEntity } from '../answer.entity';
import { DiagnosisPhase } from '../diagnosis-engine';
import { SessionEntity } from '../session.entity';

export class TrajectoryEventResponse {
  @ApiProperty({ example: 1 })
  step: number;

  @ApiProperty({ example: 5 })
  tested_level: number;

  @ApiProperty({ example: 7 })
  question_id: number;

  @ApiProperty({ enum: ['search', 'roadmap'], example: 'search' })
  phase_at_answer: DiagnosisPhase;

  @ApiProperty({ example: true })
  passed: boolean;

  @ApiProperty({ example: 0 })
  floor_after: number;

  @ApiProperty({ example: 9 })
  ceiling_after: number;

  @ApiProperty({ example: '2026-04-27T12:34:56Z' })
  answered_at: Date;

  static fromEntity(entity: AnswerEntity): TrajectoryEventResponse {
    const r = new TrajectoryEventResponse();
    r.step = entity.step;
    r.tested_level = entity.tested_level;
    r.question_id = entity.question_id;
    r.phase_at_answer = entity.phase_at_answer;
    r.passed = entity.passed;
    r.floor_after = entity.floor_after;
    r.ceiling_after = entity.ceiling_after;
    r.answered_at = entity.answered_at;
    return r;
  }
}

export class RoadmapGapResponse {
  @ApiProperty({ example: 12 })
  question_id: number;

  @ApiProperty({ example: 6 })
  level_index: number;

  @ApiProperty({ example: 3 })
  order_in_level: number;

  @ApiProperty({
    example:
      'A startup definiu formalmente um processo/roteiro de vendas.',
  })
  text: string;
}

export class RoadmapResponse {
  @ApiProperty({
    example: 6,
    nullable: true,
    description:
      'Level enumerated to build the gap list (= final_level + 1). Null when final_level == max_level.',
  })
  next_level: number | null;

  @ApiProperty({
    example: 'CRL 6 — Benefícios confirmados em testes',
    nullable: true,
  })
  next_level_name: string | null;

  @ApiProperty({
    type: [RoadmapGapResponse],
    description: 'Affirmatives of the next level still to be met.',
  })
  missing_affirmatives: RoadmapGapResponse[];
}

export class SessionResultResponse {
  @ApiProperty({ example: 'b8c1e6d2-1f2a-4c0a-9b3e-6e0f2b5a0001' })
  session_id: string;

  @ApiProperty({ example: 5 })
  declared_level: number;

  @ApiProperty({
    example: 6,
    nullable: true,
    description: 'Highest level fully met (0 if none).',
  })
  final_level: number | null;

  @ApiProperty({ example: 'completed' })
  phase: DiagnosisPhase;

  @ApiProperty({ example: 12 })
  total_answers: number;

  @ApiProperty({ type: () => RoadmapResponse })
  roadmap: RoadmapResponse;

  @ApiProperty({ type: [TrajectoryEventResponse] })
  trajectory: TrajectoryEventResponse[];

  static build(
    session: SessionEntity,
    answers: AnswerEntity[],
    roadmapLevel: LevelEntity | null,
    roadmapAffirmatives: QuestionEntity[],
  ): SessionResultResponse {
    const answersByQuestionId = new Map<number, AnswerEntity>();
    for (const a of answers) answersByQuestionId.set(a.question_id, a);

    const missing = roadmapAffirmatives
      .filter((q) => answersByQuestionId.get(q.id)?.passed !== true)
      .map<RoadmapGapResponse>((q) => ({
        question_id: q.id,
        level_index: roadmapLevel?.level_index ?? 0,
        order_in_level: q.order_in_level,
        text: q.text,
      }));

    const r = new SessionResultResponse();
    r.session_id = session.id;
    r.declared_level = session.declared_level;
    r.final_level = session.final_level;
    r.phase = session.phase;
    r.total_answers = answers.length;
    r.roadmap = {
      next_level: roadmapLevel?.level_index ?? null,
      next_level_name: roadmapLevel?.name ?? null,
      missing_affirmatives: missing,
    };
    r.trajectory = answers.map((a) => TrajectoryEventResponse.fromEntity(a));
    return r;
  }
}
