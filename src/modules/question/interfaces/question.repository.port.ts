import { EntityManager } from 'typeorm';
import { QuestionEntity } from '../question.entity';
import { KthDimension, LevelEntity } from '../level.entity';

export const QUESTION_REPOSITORY = Symbol('QUESTION_REPOSITORY');

export interface IQuestionRepository {
  findAllLevels(
    dimension: KthDimension,
    manager?: EntityManager,
  ): Promise<LevelEntity[]>;

  findLevelByIndex(
    dimension: KthDimension,
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<LevelEntity | null>;

  saveLevel(level: LevelEntity, manager?: EntityManager): Promise<LevelEntity>;

  findQuestionById(
    id: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity | null>;

  findQuestionsByLevelIndex(
    dimension: KthDimension,
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity[]>;

  /**
   * Returns a Map<level_index, affirmative_count> for the given dimension.
   * Used by the diagnosis engine as a synchronous lookup of how many
   * affirmatives a level has.
   */
  countAffirmativesByLevel(
    dimension: KthDimension,
    manager?: EntityManager,
  ): Promise<Map<number, number>>;

  findQuestionByLevelAndOrder(
    levelId: number,
    order: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity | null>;

  saveQuestion(
    question: QuestionEntity,
    manager?: EntityManager,
  ): Promise<QuestionEntity>;
}
