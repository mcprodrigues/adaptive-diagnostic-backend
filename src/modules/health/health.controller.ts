import { Controller, Get } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { SkipThrottle } from '@nestjs/throttler';
import {
  HealthCheck,
  HealthCheckService,
  TypeOrmHealthIndicator,
} from '@nestjs/terminus';

@ApiTags('Health')
@Controller('health')
@SkipThrottle()
export class HealthController {
  constructor(
    private readonly health: HealthCheckService,
    private readonly typeorm: TypeOrmHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: 'Application health check.' })
  @ApiResponse({ status: 200, description: 'OK' })
  @ApiResponse({ status: 503, description: 'Service unavailable' })
  check() {
    return this.health.check([() => this.typeorm.pingCheck('database')]);
  }
}
