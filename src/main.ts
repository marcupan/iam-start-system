import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConfigService } from '@nestjs/config';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

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
      whitelist: true, // Automatically remove unwanted properties from the DTO
      forbidNonWhitelisted: true, // Throw an error if there are extra properties
      transform: true, // Automatically transform request payloads to DTO instances
    }),
  );

  // Graceful shutdown hooks
  app.enableShutdownHooks();

  // Start the server
  await app.listen(port);
  console.log(`🚀 Application is running on: http://localhost:${port}`);
}

bootstrap();
