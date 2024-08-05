import { OrderDto } from '../../api/dto/order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';

export interface IOrderPort {
    createOrder(orderDto: OrderDto): Promise<OrderEntity>;
    findAllOrders(): Promise<any[]>;
    findOrderById(id: string): Promise<any>;
    updateOrder(id: string, orderDto: OrderDto): Promise<any>;
    deleteOrder(id: string): Promise<void>;
    findOrdersByStatus(): Promise<any[]>;
}
