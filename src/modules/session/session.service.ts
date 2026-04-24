import { Injectable } from '@nestjs/common';
import { ISessionService } from './interfaces/session.service.port';
import { StartSessionUseCase } from './use-cases/start-session.use-case';
import { SubmitAnswerUseCase } from './use-cases/submit-answer.use-case';
import { GetSessionResultUseCase } from './use-cases/get-session-result.use-case';
import { StartSessionDto } from './dto/start-session.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SessionStepResponse } from './dto/session-step-response.dto';
import { SessionResultResponse } from './dto/session-result-response.dto';

@Injectable()
export class SessionService implements ISessionService {
  constructor(
    private readonly startSessionUseCase: StartSessionUseCase,
    private readonly submitAnswerUseCase: SubmitAnswerUseCase,
    private readonly getSessionResultUseCase: GetSessionResultUseCase,
  ) {}

  start(data: StartSessionDto): Promise<SessionStepResponse> {
    return this.startSessionUseCase.execute(data);
  }

  submitAnswer(
    sessionId: string,
    data: SubmitAnswerDto,
  ): Promise<SessionStepResponse> {
    return this.submitAnswerUseCase.execute(sessionId, data);
  }

  getResult(sessionId: string): Promise<SessionResultResponse> {
    return this.getSessionResultUseCase.execute(sessionId);
  }
}
