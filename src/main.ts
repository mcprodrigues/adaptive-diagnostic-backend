import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
    }),
  );

  app.enableCors({
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    credentials: true,
  });

  const config = new DocumentBuilder()
    .setTitle('Form — Startup Maturity Diagnosis API')
    .setDescription(
      'Adaptive binary-search diagnosis engine that classifies a startup into a maturity level with the minimum number of questions possible.',
    )
    .setVersion('0.1.0')
    .addTag('Sessions', 'Diagnosis sessions — start, answer, get result')
    .addTag('Questions', 'Levels and question catalog (debug/admin)')
    .addTag('Health', 'Health checks')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document, {
    customSiteTitle: 'Form API Documentation',
    swaggerOptions: {
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
    },
  });

  const port = process.env.PORT ?? 3000;
  await app.listen(port);
  console.log(`Form API running at http://localhost:${port}`);
  console.log(`Swagger docs at http://localhost:${port}/api/docs`);
}

void bootstrap();
