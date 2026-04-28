import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppError } from 'src/shared/errors/app-error';
import { NotFoundError } from 'src/shared/errors/not-found-error';
import { KthDimension } from 'src/modules/question/level.entity';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from 'src/modules/question/interfaces/question.repository.port';
import {
  ISessionRepository,
  SESSION_REPOSITORY,
} from '../interfaces/session.repository.port';
import { AnswerEntity } from '../answer.entity';
import { DiagnosisPhase } from '../diagnosis-engine';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { SessionStepResponse } from '../dto/session-step-response.dto';
import { pickNextQuestion } from './next-question.helper';

@Injectable()
export class SubmitAnswerUseCase {
  private readonly logger = new Logger(SubmitAnswerUseCase.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async execute(
    sessionId: string,
    data: SubmitAnswerDto,
  ): Promise<SessionStepResponse> {
    try {
      return await this.dataSource.transaction(async (manager) => {
        const session = await this.sessionRepository.findById(
          sessionId,
          manager,
        );
        if (!session) {
          throw new NotFoundError(`Session ${sessionId} not found.`);
        }
        if (session.phase === DiagnosisPhase.COMPLETED) {
          throw new AppError('Session is already completed.', 400);
        }

        const question = await this.questionRepository.findQuestionById(
          data.question_id,
          manager,
        );
        if (!question) {
          throw new NotFoundError(`Question ${data.question_id} not found.`);
        }
        if (question.level?.level_index !== session.current_level) {
          throw new AppError(
            `Question ${data.question_id} is not part of the current level (${session.current_level}).`,
            400,
          );
        }

        const phaseAtAnswer = session.phase;
        const testedLevel = session.current_level;
        const step =
          (await this.sessionRepository.countAnswersBySessionId(
            sessionId,
            manager,
          )) + 1;

        const counts = await this.questionRepository.countAffirmativesByLevel(
          KthDimension.CRL,
          manager,
        );
        const affirmativesAtLevel = (level: number): number =>
          counts.get(level) ?? 0;

        session.answer(data.passed, affirmativesAtLevel);
        await this.sessionRepository.save(session, manager);

        const answer = new AnswerEntity();
        answer.session_id = session.id;
        answer.question_id = question.id;
        answer.step = step;
        answer.tested_level = testedLevel;
        answer.phase_at_answer = phaseAtAnswer;
        answer.passed = data.passed;
        answer.floor_after = session.floor;
        answer.ceiling_after = session.ceiling;
        await this.sessionRepository.saveAnswer(answer, manager);

        // session.answer mutates phase; cast bypasses TS's stale narrowing
        // from the early guard above.
        let next: Awaited<ReturnType<typeof pickNextQuestion>> = null;
        if ((session.phase as DiagnosisPhase) !== DiagnosisPhase.COMPLETED) {
          const answeredIds =
            await this.sessionRepository.findAnsweredQuestionIds(
              session.id,
              manager,
            );
          next = await pickNextQuestion(
            this.questionRepository,
            KthDimension.CRL,
            session.current_level,
            answeredIds,
            manager,
          );

          // In roadmap phase the engine's internal counter can diverge from
          // reality when the search phase already probed the roadmap level.
          // Truth is the catalog: no more affirmatives to ask → done.
          if (!next && session.phase === DiagnosisPhase.ROADMAP) {
            session.completeRoadmap();
            await this.sessionRepository.save(session, manager);
          }
        }

        return SessionStepResponse.fromEntity(session, next);
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      if (error instanceof NotFoundError) throw error;
      const err = error as Error;
      this.logger.error(`Error submitting answer: ${err.message}`, err.stack);
      throw new AppError('Internal server error', 500);
    }
  }
}
