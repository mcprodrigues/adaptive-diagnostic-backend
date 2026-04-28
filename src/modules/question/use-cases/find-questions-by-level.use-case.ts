import { Inject, Injectable, Logger } from '@nestjs/common';
import { KthDimension } from '../level.entity';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from '../interfaces/question.repository.port';
import { QuestionResponse } from '../dto/question-response.dto';
import { AppError } from 'src/shared/errors/app-error';

@Injectable()
export class FindQuestionsByLevelUseCase {
  private readonly logger = new Logger(FindQuestionsByLevelUseCase.name);

  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly repository: IQuestionRepository,
  ) {}

  async execute(levelIndex: number): Promise<QuestionResponse[]> {
    try {
      const level = await this.repository.findLevelByIndex(
        KthDimension.CRL,
        levelIndex,
      );
      if (!level) {
        throw new AppError(
          `Level with index ${levelIndex} not found.`,
          404,
        );
      }
      const questions = await this.repository.findQuestionsByLevelIndex(
        KthDimension.CRL,
        levelIndex,
      );
      return questions.map((q) => QuestionResponse.fromEntity(q));
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      this.logger.error(
        `Failed to fetch questions by level: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new AppError(
        error instanceof Error ? error.message : 'Internal Server Error',
        500,
      );
    }
  }
}
