import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
//import { HttpExceptionFilter } from '@shared/filter/httpException.filter';
//import basicAuth from 'express-basic-auth';
//import { I18nValidationExceptionFilter, I18nValidationPipe } from 'nestjs-i18n';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const config = app.get(ConfigService);
  
  await app.listen(config.get('application.port'), () => {
    Logger.log(
      `Microservice is listening on port: ${process.env.SERVICE_PORT}`,
      'NestListener',
    );
  });
}

bootstrap();
