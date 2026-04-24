import {
  Body,
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseUUIDPipe,
  Post,
} from '@nestjs/common';
import {
  ApiBody,
  ApiOperation,
  ApiParam,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { NotFoundError } from 'src/shared/errors/not-found-error';
import { AppError } from 'src/shared/errors/app-error';
import { SessionService } from './session.service';
import { StartSessionDto } from './dto/start-session.dto';
import { SubmitAnswerDto } from './dto/submit-answer.dto';
import { SessionStepResponse } from './dto/session-step-response.dto';
import { SessionResultResponse } from './dto/session-result-response.dto';

@ApiTags('Sessions')
@Controller('sessions')
export class SessionController {
  private readonly logger = new Logger(SessionController.name);

  constructor(private readonly sessionService: SessionService) {}

  @Post()
  @ApiOperation({ summary: 'Start a new diagnosis session.' })
  @ApiBody({ type: StartSessionDto })
  @ApiResponse({ status: 201, type: SessionStepResponse })
  async start(@Body() dto: StartSessionDto): Promise<SessionStepResponse> {
    try {
      return await this.sessionService.start(dto);
    } catch (error) {
      this.logger.error('Error starting session', error as Error);
      this.handleError(error, 'Error starting session');
    }
  }

  @Post(':id/answers')
  @ApiOperation({ summary: 'Submit an answer to the current question.' })
  @ApiParam({
    name: 'id',
    type: String,
    example: 'b8c1e6d2-1f2a-4c0a-9b3e-6e0f2b5a0001',
  })
  @ApiBody({ type: SubmitAnswerDto })
  @ApiResponse({ status: 201, type: SessionStepResponse })
  async submitAnswer(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: SubmitAnswerDto,
  ): Promise<SessionStepResponse> {
    try {
      return await this.sessionService.submitAnswer(id, dto);
    } catch (error) {
      this.logger.error('Error submitting answer', error as Error);
      this.handleError(error, 'Error submitting answer');
    }
  }

  @Get(':id/result')
  @ApiOperation({
    summary: 'Get the final result and trajectory of a session.',
  })
  @ApiParam({ name: 'id', type: String })
  @ApiResponse({ status: 200, type: SessionResultResponse })
  async getResult(
    @Param('id', ParseUUIDPipe) id: string,
  ): Promise<SessionResultResponse> {
    try {
      return await this.sessionService.getResult(id);
    } catch (error) {
      this.logger.error('Error getting result', error as Error);
      this.handleError(error, 'Error getting result');
    }
  }

  private handleError(error: unknown, fallback: string): never {
    if (error instanceof NotFoundError) {
      throw new NotFoundException(error.message);
    }
    if (error instanceof AppError) {
      throw new HttpException(error.message, error.statusCode ?? 400);
    }
    throw new InternalServerErrorException(
      (error as any)?.message ?? fallback ?? 'Unexpected error.',
    );
  }
}
