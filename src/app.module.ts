
import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { HealthController } from 'src/api/controllers/health.controller';
import { ConfigModule } from '@nestjs/config';
import Configuration from 'src/config/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderController } from './api/controllers/order.controller';
import { OrderUseCase } from './domain/use-cases/order.use-case';
import { OrderAdapter } from './infrastructure/adapters/order.adapter';
import { Order } from './infrastructure/entities/order.entity';
import { OrderProduct } from './infrastructure/entities/order-product.entity';
import { rabbitmqConfig } from './config/rabbitmq.config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { UserAgentMiddleware } from './middleware/user-agent.middleware';

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [Configuration],
      isGlobal: true,
    }),
    ClientsModule.register([
      {
        name: 'RABBITMQ_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [rabbitmqConfig.url],
          queue: rabbitmqConfig.queue,
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    ClientsModule.register([
      {
        name: 'PAYMENT_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: [process.env.RABBITMQ_URI],
          queue: 'payment_confirm_queue',
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'orderuser',
      password: 'dm091u0e2nud876',
      database: 'food_ordering',
      entities: [Order, OrderProduct],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order, OrderProduct]),
  ],
  controllers: [HealthController, OrderController],
  providers: [
    OrderUseCase,
    { provide: 'IOrderPort', useClass: OrderAdapter },
  ],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAgentMiddleware)
      .forRoutes('*');
  }
}
