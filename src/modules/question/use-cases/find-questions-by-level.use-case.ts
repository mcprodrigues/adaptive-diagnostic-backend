import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/shared/errors/not-found-error';
import { KthDimension } from '../level.entity';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from '../interfaces/question.repository.port';
import { QuestionResponse } from '../dto/question-response.dto';

@Injectable()
export class FindQuestionsByLevelUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly repository: IQuestionRepository,
  ) {}

  async execute(levelIndex: number): Promise<QuestionResponse[]> {
    const level = await this.repository.findLevelByIndex(
      KthDimension.CRL,
      levelIndex,
    );
    if (!level) {
      throw new NotFoundError(`Level with index ${levelIndex} not found.`);
    }
    const questions = await this.repository.findQuestionsByLevelIndex(
      KthDimension.CRL,
      levelIndex,
    );
    return questions.map((q) => QuestionResponse.fromEntity(q));
  }
}
