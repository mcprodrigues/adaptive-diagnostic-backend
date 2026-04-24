import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Root')
@Controller()
@SkipThrottle()
export class AppController {
  @Get()
  @ApiOperation({ summary: 'API root.' })
  @ApiResponse({ status: 200, description: 'Welcome payload.' })
  root(): { message: string; timestamp: string } {
    return {
      message: 'Form VRP API Gateway is running',
      timestamp: new Date().toISOString(),
    };
  }
}
