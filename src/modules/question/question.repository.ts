import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { EntityManager, Repository } from 'typeorm';
import { QuestionEntity } from './question.entity';
import { KthDimension, LevelEntity } from './level.entity';
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

  async findAllLevels(
    dimension: KthDimension,
    manager?: EntityManager,
  ): Promise<LevelEntity[]> {
    return this.lRepo(manager).find({
      where: { dimension },
      order: { level_index: 'ASC' },
    });
  }

  async findLevelByIndex(
    dimension: KthDimension,
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<LevelEntity | null> {
    return this.lRepo(manager).findOne({
      where: { dimension, level_index: levelIndex },
    });
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
    dimension: KthDimension,
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity[]> {
    const level = await this.findLevelByIndex(dimension, levelIndex, manager);
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

  async countAffirmativesByLevel(
    dimension: KthDimension,
    manager?: EntityManager,
  ): Promise<Map<number, number>> {
    const rows = await this.qRepo(manager)
      .createQueryBuilder('q')
      .innerJoin('q.level', 'l')
      .select('l.level_index', 'level_index')
      .addSelect('COUNT(q.id)', 'count')
      .where('l.dimension = :dimension', { dimension })
      .groupBy('l.level_index')
      .getRawMany<{ level_index: number; count: string }>();

    const map = new Map<number, number>();
    for (const row of rows) {
      map.set(Number(row.level_index), Number(row.count));
    }
    return map;
  }
}
