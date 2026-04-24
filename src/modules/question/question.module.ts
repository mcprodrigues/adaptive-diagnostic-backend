import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LevelEntity } from './level.entity';
import { QuestionEntity } from './question.entity';
import { QuestionController } from './question.controller';
import { QuestionService } from './question.service';
import { QuestionRepository } from './question.repository';
import { QUESTION_REPOSITORY } from './interfaces/question.repository.port';
import { FindAllLevelsUseCase } from './use-cases/find-all-levels.use-case';
import { FindQuestionsByLevelUseCase } from './use-cases/find-questions-by-level.use-case';

@Module({
  imports: [TypeOrmModule.forFeature([LevelEntity, QuestionEntity])],
  controllers: [QuestionController],
  providers: [
    FindAllLevelsUseCase,
    FindQuestionsByLevelUseCase,
    QuestionService,
    {
      provide: QUESTION_REPOSITORY,
      useClass: QuestionRepository,
    },
  ],
  exports: [QuestionService, QUESTION_REPOSITORY],
})
export class QuestionModule {}
