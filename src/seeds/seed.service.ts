import { Inject, Injectable, Logger } from '@nestjs/common';
import { DataSource, EntityManager } from 'typeorm';

import {
  IQuestionRepository,
  QUESTION_REPOSITORY,
} from 'src/modules/question/interfaces/question.repository.port';
import { LevelEntity } from 'src/modules/question/level.entity';
import { QuestionEntity } from 'src/modules/question/question.entity';

import { LEVELS_SEEDS } from './data/levels.seed';
import { QUESTIONS_SEEDS } from './data/questions.seed';

@Injectable()
export class SeederService {
  private readonly logger = new Logger(SeederService.name);

  constructor(
    private readonly dataSource: DataSource,
    @Inject(QUESTION_REPOSITORY)
    private readonly questionRepository: IQuestionRepository,
  ) {}

  async onModuleInit() {
    await this.seed();
  }

  async seed() {
    this.logger.log('Applying seeds...');

    await this.dataSource.transaction(async (manager) => {
      await this.seedLevels(manager);
      await this.seedQuestions(manager);
    });

    this.logger.log('Seeding completed.');
  }

  private async seedLevels(manager: EntityManager) {
    for (const seed of LEVELS_SEEDS) {
      const exists = await this.questionRepository.findLevelByIndex(
        seed.level_index,
        manager,
      );
      if (exists) continue;

      const entity = new LevelEntity();
      entity.level_index = seed.level_index;
      entity.name = seed.name;
      entity.description = seed.description;
      entity.validate();
      await this.questionRepository.saveLevel(entity, manager);
    }
  }

  private async seedQuestions(manager: EntityManager) {
    for (const seed of QUESTIONS_SEEDS) {
      const level = await this.questionRepository.findLevelByIndex(
        seed.level_index,
        manager,
      );
      if (!level) {
        this.logger.warn(
          `Skipping question for level ${seed.level_index} (not seeded).`,
        );
        continue;
      }

      const exists = await this.questionRepository.findQuestionByLevelAndOrder(
        level.id,
        seed.order_in_level,
        manager,
      );
      if (exists) continue;

      const entity = new QuestionEntity();
      entity.level_id = level.id;
      entity.text = seed.text;
      entity.question_type = seed.question_type;
      entity.order_in_level = seed.order_in_level;
      entity.options = seed.options;
      entity.validate();
      await this.questionRepository.saveQuestion(entity, manager);
    }
  }
}
