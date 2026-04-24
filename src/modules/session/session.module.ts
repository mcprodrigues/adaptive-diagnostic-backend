import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SessionEntity } from './session.entity';
import { AnswerEntity } from './answer.entity';
import { SessionController } from './session.controller';
import { SessionService } from './session.service';
import { SessionRepository } from './session.repository';
import { SESSION_REPOSITORY } from './interfaces/session.repository.port';
import { StartSessionUseCase } from './use-cases/start-session.use-case';
import { SubmitAnswerUseCase } from './use-cases/submit-answer.use-case';
import { GetSessionResultUseCase } from './use-cases/get-session-result.use-case';
import { QuestionModule } from '../question/question.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([SessionEntity, AnswerEntity]),
    QuestionModule,
  ],
  controllers: [SessionController],
  providers: [
    StartSessionUseCase,
    SubmitAnswerUseCase,
    GetSessionResultUseCase,
    SessionService,
    {
      provide: SESSION_REPOSITORY,
      useClass: SessionRepository,
    },
  ],
  exports: [SessionService, SESSION_REPOSITORY],
})
export class SessionModule {}
