import {
  Controller,
  Get,
  HttpException,
  InternalServerErrorException,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger';
import { NotFoundError } from 'src/shared/errors/not-found-error';
import { AppError } from 'src/shared/errors/app-error';
import { QuestionService } from './question.service';
import { LevelResponse } from './dto/level-response.dto';
import { QuestionResponse } from './dto/question-response.dto';

@ApiTags('Questions')
@Controller()
export class QuestionController {
  private readonly logger = new Logger(QuestionController.name);

  constructor(private readonly questionService: QuestionService) {}

  @Get('levels')
  @ApiOperation({ summary: 'List all maturity levels' })
  @ApiResponse({ status: 200, type: [LevelResponse] })
  async listLevels(): Promise<LevelResponse[]> {
    try {
      return await this.questionService.listLevels();
    } catch (error) {
      this.logger.error('Error listing levels', error as Error);
      this.handleError(error, 'Error listing levels');
    }
  }

  @Get('levels/:levelIndex/questions')
  @ApiOperation({ summary: 'List questions by level index (debug/admin)' })
  @ApiParam({ name: 'levelIndex', type: Number, example: 2 })
  @ApiResponse({ status: 200, type: [QuestionResponse] })
  @ApiResponse({ status: 404, description: 'Level not found' })
  async findByLevel(
    @Param('levelIndex', ParseIntPipe) levelIndex: number,
  ): Promise<QuestionResponse[]> {
    try {
      return await this.questionService.findQuestionsByLevel(levelIndex);
    } catch (error) {
      this.logger.error('Error finding questions', error as Error);
      this.handleError(error, 'Error finding questions');
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
