
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
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './config/jwt.strategy';
import { Client } from './domain/entities/client.entity';
import { ClientController } from './api/controllers/client.controller';
import { ClientService } from './domain/use-cases/client.service';
import { UserAgentMiddleware } from './middleware/user-agent.middleware';

@Module({
  imports: [
    PassportModule,
    JwtModule.register({
      secret: 'UiHUigyEe8b22XPvdhPEQlUXHBEjjJSUQIihTPkUpmbEphpFQ8CQO8FrWyg6U416W1CnlYWNO7yxhs60Zf7XHA==',
      signOptions: { expiresIn: '60m' },
    }),
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
          queue: process.env.PAYMENT_QUEUE,
          queueOptions: {
            durable: false
          },
        },
      },
    ]),
    TypeOrmModule.forRoot({
      type: 'mysql',
      host: process.env.DB_HOST,
      port: Number(process.env.DB_PORT),
      username: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [Order, OrderProduct],
      synchronize: true,
    }),
    TypeOrmModule.forFeature([Order, OrderProduct, Client]),
  ],
  controllers: [HealthController, OrderController, ClientController],
  providers: [
    ClientService,
    JwtStrategy,
    OrderUseCase,
    { provide: 'IOrderPort', useClass: OrderAdapter },
  ],
  exports: [JwtModule, PassportModule],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserAgentMiddleware)
      .forRoutes('*');
  }
}
