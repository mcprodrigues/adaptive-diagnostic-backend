import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { SessionEntity } from './session.entity';
import { AnswerEntity } from './answer.entity';
import { ISessionRepository } from './interfaces/session.repository.port';

@Injectable()
export class SessionRepository implements ISessionRepository {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepo: Repository<SessionEntity>,
    @InjectRepository(AnswerEntity)
    private readonly answerRepo: Repository<AnswerEntity>,
  ) {}

  private sRepo(manager?: EntityManager): Repository<SessionEntity> {
    return manager ? manager.getRepository(SessionEntity) : this.sessionRepo;
  }

  private aRepo(manager?: EntityManager): Repository<AnswerEntity> {
    return manager ? manager.getRepository(AnswerEntity) : this.answerRepo;
  }

  async findById(
    id: string,
    manager?: EntityManager,
  ): Promise<SessionEntity | null> {
    return this.sRepo(manager).findOne({ where: { id } });
  }

  async save(
    session: SessionEntity,
    manager?: EntityManager,
  ): Promise<SessionEntity> {
    return this.sRepo(manager).save(session);
  }

  async saveAnswer(
    answer: AnswerEntity,
    manager?: EntityManager,
  ): Promise<AnswerEntity> {
    return this.aRepo(manager).save(answer);
  }

  async findAnswersBySessionId(
    sessionId: string,
    manager?: EntityManager,
  ): Promise<AnswerEntity[]> {
    return this.aRepo(manager).find({
      where: { session_id: sessionId },
      order: { step: 'ASC' },
    });
  }

  async countAnswersBySessionId(
    sessionId: string,
    manager?: EntityManager,
  ): Promise<number> {
    return this.aRepo(manager).count({ where: { session_id: sessionId } });
  }

  async findAnsweredQuestionIds(
    sessionId: string,
    manager?: EntityManager,
  ): Promise<number[]> {
    const rows = await this.aRepo(manager).find({
      where: { session_id: sessionId },
      select: ['question_id'],
    });
    return rows.map((r) => r.question_id);
  }
}
