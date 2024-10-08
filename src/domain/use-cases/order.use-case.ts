import { Inject, Injectable } from '@nestjs/common';
import { IOrderPort } from '../ports/order.port';
import { OrderDto } from '../../api/dto/order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';

@Injectable()
export class OrderUseCase {
    constructor(@Inject('IOrderPort') private readonly orderPort: IOrderPort) { }

    createOrder(orderDto: OrderDto): Promise<OrderEntity> {
        return this.orderPort.createOrder(orderDto);
    }

    findAllOrders(): Promise<any[]> {
        return this.orderPort.findAllOrders();
    }

    findOrderById(id: string): Promise<any> {
        return this.orderPort.findOrderById(id);
    }

    updateOrder(id: string, orderDto: OrderDto): Promise<any> {
        return this.orderPort.updateOrder(id, orderDto);
    }

    deleteOrder(id: string): Promise<void> {
        return this.orderPort.deleteOrder(id);
    }

    async updateOrderStatus(id: string, status: string): Promise<void> {
        const order = await this.findOrderById(id);
        if (!order) {
            throw new Error('Order not found');
        }
        const updatedOrderDto: OrderDto = { ...order, status };
        await this.orderPort.updateOrder(id, updatedOrderDto);
    }

    async findOrdersByStatus(): Promise<any[]> {
        
        return this.orderPort.findOrdersByStatus();
    }
}
