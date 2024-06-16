import { Injectable } from '@nestjs/common';
import { EventPattern, Payload } from '@nestjs/microservices';
import { OrderUseCase } from '../../domain/use-cases/order.use-case';

@Injectable()
export class OrderConsumer {
    constructor(private readonly orderUseCase: OrderUseCase) { }

    @EventPattern('payment_confirm')
    async handleOrderNotification(@Payload() message: any) {
        const { data } = message;
        const { orderId } = data;
        await this.orderUseCase.updateOrderStatus(orderId, 'em preparação');
    }
}
