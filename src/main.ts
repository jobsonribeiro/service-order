import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import helmet from 'helmet';

async function bootstrap() {


  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.URL_AMQP],
      queue: 'payment_confirm_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  microservice.listen();

  const microserviceOrder = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.URL_AMQP],
      queue: 'order_finish_queue',
      queueOptions: {
        durable: false,
      },
    },
  });

  microserviceOrder.listen();
  const app = await NestFactory.create(AppModule);

  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        scriptSrc: ["'self'"],
        styleSrc: ["'self'"],
        imgSrc: ["'self'", 'data:'],
        connectSrc: ["'self'"],
        fontSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'self'"],
        baseUri: ["'self'"],
        formAction: ["'self'"]
      }
    }
  }));

  const config = app.get(ConfigService);
  
  await app.listen(config.get('application.port'), () => {
    Logger.log(
      `Microservice is listening on port: ${process.env.SERVICE_PORT}`,
      'NestListener',
    );
  });
}

bootstrap();
