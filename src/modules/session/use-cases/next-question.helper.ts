import { QuestionEntity } from 'src/modules/question/question.entity';
import { IQuestionRepository } from 'src/modules/question/interfaces/question.repository.port';

export async function pickNextQuestion(
  questionRepository: IQuestionRepository,
  currentLevelIndex: number,
  answeredQuestionIds: number[],
): Promise<QuestionEntity | null> {
  const all =
    await questionRepository.findQuestionsByLevelIndex(currentLevelIndex);
  const answeredSet = new Set(answeredQuestionIds);
  return all.find((q) => !answeredSet.has(q.id)) ?? null;
}
