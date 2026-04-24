import { Inject, Injectable } from '@nestjs/common';
import { NotFoundError } from 'src/shared/errors/not-found-error';
import {
  ISessionRepository,
  SESSION_REPOSITORY,
} from '../interfaces/session.repository.port';
import { SessionResultResponse } from '../dto/session-result-response.dto';

@Injectable()
export class GetSessionResultUseCase {
  constructor(
    @Inject(SESSION_REPOSITORY)
    private readonly sessionRepository: ISessionRepository,
  ) {}

  async execute(sessionId: string): Promise<SessionResultResponse> {
    const session = await this.sessionRepository.findById(sessionId);
    if (!session) {
      throw new NotFoundError(`Session ${sessionId} not found.`);
    }
    const answers =
      await this.sessionRepository.findAnswersBySessionId(sessionId);
    return SessionResultResponse.fromEntity(session, answers);
  }
}
