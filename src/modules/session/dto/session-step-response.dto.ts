import { ApiProperty } from '@nestjs/swagger';
import { QuestionResponse } from 'src/modules/question/dto/question-response.dto';
import { QuestionEntity } from 'src/modules/question/question.entity';
import { DiagnosisStatus } from '../diagnosis-engine';
import { SessionEntity } from '../session.entity';

export class SessionProgress {
  @ApiProperty({ example: 0 })
  floor: number;

  @ApiProperty({ example: 4 })
  ceiling: number;

  @ApiProperty({ example: 2 })
  current_level: number;

  @ApiProperty({ example: 3 })
  current_level_answered: number;

  @ApiProperty({ example: 5 })
  questions_per_level: number;

  @ApiProperty({ example: 4 })
  max_level: number;

  static fromEntity(entity: SessionEntity): SessionProgress {
    const progress = new SessionProgress();
    progress.floor = entity.floor;
    progress.ceiling = entity.ceiling;
    progress.current_level = entity.current_level;
    progress.current_level_answered = entity.current_level_answered;
    progress.questions_per_level = entity.questions_per_level;
    progress.max_level = entity.max_level;
    return progress;
  }
}

export class SessionStepResponse {
  @ApiProperty({ example: 'b8c1e6d2-1f2a-4c0a-9b3e-6e0f2b5a0001' })
  session_id: string;

  @ApiProperty({ enum: ['in_progress', 'completed'], example: 'in_progress' })
  status: DiagnosisStatus;

  @ApiProperty({ example: false })
  done: boolean;

  @ApiProperty({ type: () => QuestionResponse, nullable: true })
  next_question: QuestionResponse | null;

  @ApiProperty({ type: () => SessionProgress })
  progress: SessionProgress;

  @ApiProperty({ example: null, nullable: true })
  final_level: number | null;

  static fromEntity(
    session: SessionEntity,
    nextQuestion: QuestionEntity | null,
  ): SessionStepResponse {
    const response = new SessionStepResponse();
    response.session_id = session.id;
    response.status = session.status;
    response.done = session.status === 'completed';
    response.next_question = nextQuestion
      ? QuestionResponse.fromEntity(nextQuestion)
      : null;
    response.progress = SessionProgress.fromEntity(session);
    response.final_level = session.final_level;
    return response;
  }
}
