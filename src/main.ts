import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {


  const microservice = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.URL_AMQP],
      queue: 'payment_confirm_queue, order_finish_queue',
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

  const config = app.get(ConfigService);
  
  await app.listen(config.get('application.port'), () => {
    Logger.log(
      `Microservice is listening on port: ${process.env.SERVICE_PORT}`,
      'NestListener',
    );
  });
}

bootstrap();
