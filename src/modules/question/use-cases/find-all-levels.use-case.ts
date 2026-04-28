import { Inject, Injectable, Logger } from '@nestjs/common';
import { KthDimension } from '../level.entity';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from '../interfaces/question.repository.port';
import { LevelResponse } from '../dto/level-response.dto';
import { AppError } from 'src/shared/errors/app-error';

@Injectable()
export class FindAllLevelsUseCase {
  private readonly logger = new Logger(FindAllLevelsUseCase.name);

  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly repository: IQuestionRepository,
  ) {}

  async execute(): Promise<LevelResponse[]> {
    try {
      const levels = await this.repository.findAllLevels(KthDimension.CRL);
      return levels.map((l) => LevelResponse.fromEntity(l));
    } catch (error) {
      this.logger.error(
        `Failed to fetch levels: ${error instanceof Error ? error.message : String(error)}`,
        error instanceof Error ? error.stack : undefined,
      );
      throw new AppError('Failed to fetch levels', 500);
    }
  }
}
