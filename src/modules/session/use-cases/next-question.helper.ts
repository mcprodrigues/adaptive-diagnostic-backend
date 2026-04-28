import { EntityManager } from 'typeorm';
import { QuestionEntity } from 'src/modules/question/question.entity';
import { KthDimension } from 'src/modules/question/level.entity';
import { IQuestionRepository } from 'src/modules/question/interfaces/question.repository.port';

export async function pickNextQuestion(
  questionRepository: IQuestionRepository,
  dimension: KthDimension,
  currentLevelIndex: number,
  answeredQuestionIds: number[],
  manager?: EntityManager,
): Promise<QuestionEntity | null> {
  const all = await questionRepository.findQuestionsByLevelIndex(
    dimension,
    currentLevelIndex,
    manager,
  );
  const answered = new Set(answeredQuestionIds);
  return all.find((q) => !answered.has(q.id)) ?? null;
}
