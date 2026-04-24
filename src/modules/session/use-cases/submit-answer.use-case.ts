import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { AppError } from 'src/shared/errors/app-error';
import { NotFoundError } from 'src/shared/errors/not-found-error';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from 'src/modules/question/interfaces/question.repository.port';
import {
  ISessionRepository,
  SESSION_REPOSITORY,
} from '../interfaces/session.repository.port';
import { AnswerEntity } from '../answer.entity';
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
        if (session.status === 'completed') {
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

        const passed = question.evaluate(data.value);
        const testedLevel = session.current_level;
        const step =
          (await this.sessionRepository.countAnswersBySessionId(
            sessionId,
            manager,
          )) + 1;

        session.answer(passed);
        await this.sessionRepository.save(session, manager);

        const answer = new AnswerEntity();
        answer.session_id = session.id;
        answer.question_id = question.id;
        answer.step = step;
        answer.tested_level = testedLevel;
        answer.value = data.value;
        answer.passed = passed;
        answer.floor_after = session.floor;
        answer.ceiling_after = session.ceiling;
        await this.sessionRepository.saveAnswer(answer, manager);

        const done: boolean = (session.status as string) === 'completed';
        let nextQuestion: Awaited<ReturnType<typeof pickNextQuestion>> = null;
        if (!done) {
          const answeredIds =
            await this.sessionRepository.findAnsweredQuestionIds(
              session.id,
              manager,
            );
          nextQuestion = await pickNextQuestion(
            this.questionRepository,
            session.current_level,
            answeredIds,
          );
        }

        return SessionStepResponse.fromEntity(session, nextQuestion);
      });
    } catch (error) {
      if (error instanceof AppError) throw error;
      const err = error as Error;
      this.logger.error(`Error submitting answer: ${err.message}`, err.stack);
      throw new AppError('Internal server error', 500);
    }
  }
}
