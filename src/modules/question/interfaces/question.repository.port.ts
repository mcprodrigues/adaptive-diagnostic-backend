import { EntityManager } from 'typeorm';
import { QuestionEntity } from '../question.entity';
import { LevelEntity } from '../level.entity';

export const QUESTION_REPOSITORY = Symbol('QUESTION_REPOSITORY');

export interface IQuestionRepository {
  findAllLevels(manager?: EntityManager): Promise<LevelEntity[]>;

  findLevelByIndex(
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<LevelEntity | null>;

  saveLevel(level: LevelEntity, manager?: EntityManager): Promise<LevelEntity>;

  findQuestionById(
    id: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity | null>;

  findQuestionsByLevelIndex(
    levelIndex: number,
    manager?: EntityManager,
  ): Promise<QuestionEntity[]>;

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
