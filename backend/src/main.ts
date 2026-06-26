import 'dotenv/config';
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { getEnvNumber } from './config/env';

function getCorsOrigins(): string[] | boolean {
  const corsOrigin = process.env.CORS_ORIGIN;

  if (!corsOrigin || corsOrigin === '*') {
    return true;
  }

  return corsOrigin.split(',').map((origin) => origin.trim());
}

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);

  app.enableCors({
    origin: getCorsOrigins(),
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(getEnvNumber('PORT', 3000));
}
bootstrap();
