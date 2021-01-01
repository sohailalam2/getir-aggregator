import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';

import { AppModule } from './app.module';
import { HttpExceptionFilter } from './utils/http-exception.filter';

/**
 * Bootstrap the application and start it at the designated port
 */
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config: ConfigService = await app.get<ConfigService>(ConfigService);

  const port = config.get('PORT') || 3000;

  // enable validations for the data transfer objects (DTO)
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
      whitelist: true,
      dismissDefaultMessages: false,
      forbidUnknownValues: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new HttpExceptionFilter());

  // start the server on the given port
  await app.listen(port);
}

bootstrap();
