
import { Module } from '@nestjs/common';
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
      entities: [Order, OrderProduct, Client],
      autoLoadEntities: true,
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
export class AppModule { }
