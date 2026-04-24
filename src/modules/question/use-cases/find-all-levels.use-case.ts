import { Inject, Injectable } from '@nestjs/common';
import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from '../interfaces/question.repository.port';
import { LevelResponse } from '../dto/level-response.dto';

@Injectable()
export class FindAllLevelsUseCase {
  constructor(
    @Inject(QUESTION_REPOSITORY)
    private readonly repository: IQuestionRepository,
  ) {}

  async execute(): Promise<LevelResponse[]> {
    const levels = await this.repository.findAllLevels();
    return levels.map((l) => LevelResponse.fromEntity(l));
  }
}
