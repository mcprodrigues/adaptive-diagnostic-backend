import { LevelResponse } from '../dto/level-response.dto';
import { QuestionResponse } from '../dto/question-response.dto';

export interface IQuestionService {
  listLevels(): Promise<LevelResponse[]>;
  findQuestionsByLevel(levelIndex: number): Promise<QuestionResponse[]>;
}
