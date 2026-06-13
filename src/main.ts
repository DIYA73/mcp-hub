import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true }));
  app.enableCors();
  app.setGlobalPrefix('api/v1');
  const port = process.env['PORT'] ?? 3000;
  await app.listen(port);
  logger.log(`mcp-hub running on http://localhost:${port}/api/v1`);
  logger.log(`WebSocket logs at ws://localhost:${port}/logs`);
}

void bootstrap();
