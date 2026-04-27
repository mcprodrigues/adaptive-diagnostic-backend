import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/shared/errors/not-found-error';
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

@Injectable()
export class GetSessionResultUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(sessionId: string): Promise<SessionResultResponse> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError(`Session ${sessionId} not found.`);
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
  }
}
