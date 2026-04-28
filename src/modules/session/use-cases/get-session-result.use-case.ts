import { Inject, Injectable, Logger } from '@nestjs/common';
import { KthDimension, LevelEntity } from 'src/modules/question/level.entity';
import { QuestionEntity } from 'src/modules/question/question.entity';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from 'src/modules/question/interfaces/question.repository.port';
import {
  ISessionRepository,
  SESSION_REPOSITORY,
} from '../interfaces/session.repository.port';
import { SessionResultResponse } from '../dto/session-result-response.dto';
import { AppError } from 'src/shared/errors/app-error';

@Injectable()
export class GetSessionResultUseCase {
  private readonly logger = new Logger(GetSessionResultUseCase.name);

  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(sessionId: string): Promise<SessionResultResponse> {
    try {
      const session = await this.sessionRepository.findById(sessionId);
      if (!session) {
        throw new AppError(`Session ${sessionId} not found.`, 404);
      }
      const answers =
        await this.sessionRepository.findAnswersBySessionId(sessionId);

      // Roadmap = next-level affirmatives still missing. Available once the
      // search phase has converged (final_level set and roadmap_level present).
      let roadmapLevel: LevelEntity | null = null;
      let roadmapAffirmatives: QuestionEntity[] = [];
      if (session.roadmap_level !== null) {
        roadmapLevel = await this.questionRepository.findLevelByIndex(
          KthDimension.CRL,
          session.roadmap_level,
        );
        roadmapAffirmatives =
          await this.questionRepository.findQuestionsByLevelIndex(
            KthDimension.CRL,
            session.roadmap_level,
          );
      }

      return SessionResultResponse.build(
        session,
        answers,
        roadmapLevel,
        roadmapAffirmatives,
      );
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.logger.error(
        `Failed to get session result: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new AppError(
        error instanceof Error ? error.message : 'Internal Server Error',
        500,
      );
    }
  }
}
