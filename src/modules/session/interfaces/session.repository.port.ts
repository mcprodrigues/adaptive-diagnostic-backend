import { EntityManager } from 'typeorm';
import { SessionEntity } from '../session.entity';
import { AnswerEntity } from '../answer.entity';

export const SESSION_REPOSITORY = Symbol('SESSION_REPOSITORY');

export interface ISessionRepository {
  findById(id: string, manager?: EntityManager): Promise<SessionEntity | null>;

  save(session: SessionEntity, manager?: EntityManager): Promise<SessionEntity>;

  saveAnswer(
    answer: AnswerEntity,
    manager?: EntityManager,
  ): Promise<AnswerEntity>;

  findAnswersBySessionId(
    sessionId: string,
    manager?: EntityManager,
  ): Promise<AnswerEntity[]>;

  countAnswersBySessionId(
    sessionId: string,
    manager?: EntityManager,
  ): Promise<number>;

  findAnsweredQuestionIds(
    sessionId: string,
    manager?: EntityManager,
  ): Promise<number[]>;
}
