import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponse } from 'src/modules/question/dto/question-response.dto';
import { QuestionEntity } from 'src/modules/question/question.entity';
import { DiagnosisPhase } from '../diagnosis-engine';
import { SessionEntity } from '../session.entity';

export class SessionProgress {
  @ApiProperty({ example: 0, description: 'Highest level confirmed so far.' })
  floor: number;

  @ApiProperty({ example: 9, description: 'Upper bound of the search.' })
  ceiling: number;

  @ApiProperty({
    example: 5,
    description: 'Level being probed (search) or enumerated (roadmap).',
  })
  current_level: number;

  @ApiProperty({
    example: 2,
    description: 'Affirmatives passed at the current probed level.',
  })
  current_level_answered: number;

  @ApiProperty({ example: 9 })
  max_level: number;

  static fromEntity(entity: SessionEntity): SessionProgress {
    const p = new SessionProgress();
    p.floor = entity.floor;
    p.ceiling = entity.ceiling;
    p.current_level = entity.current_level;
    p.current_level_answered = entity.current_level_answered;
    p.max_level = entity.max_level;
    return p;
  }
}

export class SessionStepResponse {
  @ApiProperty({ example: 'b8c1e6d2-1f2a-4c0a-9b3e-6e0f2b5a0001' })
  session_id: string;

  @ApiProperty({
    enum: ['search', 'roadmap', 'completed'],
    example: 'search',
    description:
      'search: adaptive binary search; roadmap: enumerating affirmatives of finalLevel+1 to build the gap list; completed: diagnosis finished.',
  })
  phase: DiagnosisPhase;

  @ApiProperty({ example: false })
  done: boolean;

  @ApiProperty({ type: () => QuestionResponse, nullable: true })
  next_question: QuestionResponse | null;

  @ApiProperty({ type: () => SessionProgress })
  progress: SessionProgress;

  @ApiProperty({
    example: null,
    nullable: true,
    description: 'Final achieved level. Set once phase != search.',
  })
  final_level: number | null;

  static fromEntity(
    session: SessionEntity,
    nextQuestion: QuestionEntity | null,
  ): SessionStepResponse {
    const r = new SessionStepResponse();
    r.session_id = session.id;
    r.phase = session.phase;
    r.done = session.phase === 'completed';
    r.next_question = nextQuestion
      ? QuestionResponse.fromEntity(nextQuestion)
      : null;
    r.progress = SessionProgress.fromEntity(session);
    r.final_level = session.final_level;
    return r;
  }
}
