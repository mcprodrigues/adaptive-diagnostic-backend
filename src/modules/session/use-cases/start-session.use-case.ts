import { Inject, Injectable, Logger } from '@nestjs/common';
import { AppError } from 'src/shared/errors/app-error';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from 'src/modules/question/interfaces/question.repository.port';
import {
  ISessionRepository,
  SESSION_REPOSITORY,
} from '../interfaces/session.repository.port';
import { SessionEntity } from '../session.entity';
import { StartSessionDto } from '../dto/start-session.dto';
import { SessionStepResponse } from '../dto/session-step-response.dto';
import { pickNextQuestion } from './next-question.helper';

@Injectable()
export class StartSessionUseCase {
  private readonly logger = new Logger(StartSessionUseCase.name);

  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(data: StartSessionDto): Promise<SessionStepResponse> {
    try {
      const session = SessionEntity.start(data.declared_level);
      const saved = await this.sessionRepository.save(session);
      const nextQuestion = await pickNextQuestion(
        this.questionRepository,
        saved.current_level,
        [],
      );

      return SessionStepResponse.fromEntity(saved, nextQuestion);
    } catch (error) {
      if (error instanceof AppError) throw error;
      const err = error as Error;
      this.logger.error(`Error starting session: ${err.message}`, err.stack);
      throw new AppError('Internal server error', 500);
    }
  }
}
