import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';

@ApiTags('Health')
@Controller('ping')
@SkipThrottle()
export class PingController {
  @Get()
  @ApiOperation({ summary: 'Liveness ping.' })
  @ApiResponse({ status: 200, description: 'pong! with timestamp' })
  ping(): { message: string; timestamp: string } {
    return {
      message: 'pong!',
      timestamp: new Date().toISOString(),
    };
  }
}
