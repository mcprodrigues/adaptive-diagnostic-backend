import { StartSessionDto } from '../dto/start-session.dto';
import { SubmitAnswerDto } from '../dto/submit-answer.dto';
import { SessionStepResponse } from '../dto/session-step-response.dto';
import { SessionResultResponse } from '../dto/session-result-response.dto';

export interface ISessionService {
  start(data: StartSessionDto): Promise<SessionStepResponse>;
  submitAnswer(
    sessionId: string,
    data: SubmitAnswerDto,
  ): Promise<SessionStepResponse>;
  getResult(sessionId: string): Promise<SessionResultResponse>;
}
