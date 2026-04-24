import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { LevelEntity } from './level.entity';
import { IQuestionRepository } from './interfaces/question.repository.port';

@Injectable()
export class QuestionRepository implements IQuestionRepository {
  constructor(
    @InjectRepository(QuestionEntity)
    private readonly questionRepo: Repository<QuestionEntity>,
    @InjectRepository(LevelEntity)
    private readonly levelRepo: Repository<LevelEntity>,
  ) {}

  private qRepo(manager?: EntityManager): Repository<QuestionEntity> {
    return manager ? manager.getRepository(QuestionEntity) : this.questionRepo;
  }

  private lRepo(manager?: EntityManager): Repository<LevelEntity> {
    return manager ? manager.getRepository(LevelEntity) : this.levelRepo;
  }

  async findAllLevels(manager?: EntityManager): Promise<LevelEntity[]> {
    return this.lRepo(manager).find({ order: { level_index: 'ASC' } });
  }

  async findLevelByIndex(
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<LevelEntity | null> {
    return this.lRepo(manager).findOne({ where: { level_index: levelIndex } });
  }

  async saveLevel(
    level: LevelEntity,
    manager?: EntityManager,
  ): Promise<LevelEntity> {
    return this.lRepo(manager).save(level);
  }

  async findQuestionById(
    id: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity | null> {
    return this.qRepo(manager).findOne({ where: { id }, relations: ['level'] });
  }

  async findQuestionsByLevelIndex(
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity[]> {
    const level = await this.findLevelByIndex(levelIndex, manager);
    if (!level) return [];
    return this.qRepo(manager).find({
      where: { level_id: level.id },
      order: { order_in_level: 'ASC' },
      relations: ['level'],
    });
  }

  async findQuestionByLevelAndOrder(
    levelId: number,
    order: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity | null> {
    return this.qRepo(manager).findOne({
      where: { level_id: levelId, order_in_level: order },
    });
  }

  async saveQuestion(
    question: QuestionEntity,
    manager?: EntityManager,
  ): Promise<QuestionEntity> {
    return this.qRepo(manager).save(question);
  }
}
