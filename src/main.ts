import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Get environment variables
  const configService = app.get(ConfigService);
  const port = configService.get<number>('PORT') || 3000;

  // Enable CORS with a secure configuration
  app.enableCors({
    origin: configService.get<string>('CORS_ORIGIN') || '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
  });

  // Apply security headers using Helmet
  app.use(helmet());

  // Use global validation pipes to handle DTO validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  // Start the server
  await app.listen(port);
  console.log(`🚀 Application is running on port: ${port}`);
}

bootstrap();
