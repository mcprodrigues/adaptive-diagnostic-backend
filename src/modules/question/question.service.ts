import { Injectable } from '@nestjs/common';
import { IQuestionService } from './interfaces/question.service.port';
import { FindAllLevelsUseCase } from './use-cases/find-all-levels.use-case';
import { FindQuestionsByLevelUseCase } from './use-cases/find-questions-by-level.use-case';
import { LevelResponse } from './dto/level-response.dto';
import { QuestionResponse } from './dto/question-response.dto';

@Injectable()
export class QuestionService implements IQuestionService {
  constructor(
    private readonly findAllLevelsUseCase: FindAllLevelsUseCase,
    private readonly findQuestionsByLevelUseCase: FindQuestionsByLevelUseCase,
  ) {}

  listLevels(): Promise<LevelResponse[]> {
    return this.findAllLevelsUseCase.execute();
  }

  findQuestionsByLevel(levelIndex: number): Promise<QuestionResponse[]> {
    return this.findQuestionsByLevelUseCase.execute(levelIndex);
  }
}
