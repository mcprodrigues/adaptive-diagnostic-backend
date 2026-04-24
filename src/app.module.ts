import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';

import { AppController } from './app.controller';
import databaseConfig from './config/database.config';
import { DatabaseModule } from './database/database.module';
import { QuestionModule } from './modules/question/question.module';
import { SessionModule } from './modules/session/session.module';
import { SeederService } from './seeds/seed.service';
import { PingModule } from './modules/ping/ping.module';
import { HealthModule } from './modules/health/health.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
      load: [databaseConfig],
    }),
    ThrottlerModule.forRoot([
      { name: 'short', ttl: 1000, limit: 10 },
      { name: 'medium', ttl: 10000, limit: 50 },
      { name: 'long', ttl: 60000, limit: 200 },
    ]),
    DatabaseModule,
    QuestionModule,
    SessionModule,
    HealthModule,
    PingModule,
  ],
  controllers: [AppController],
  providers: [
    SeederService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
