import { OrderDto } from '../../api/dto/order.dto';

export interface IOrderPort {
    createOrder(orderDto: OrderDto): Promise<any>;
    findAllOrders(): Promise<any[]>;
    findOrderById(id: string): Promise<any>;
    updateOrder(id: string, orderDto: OrderDto): Promise<any>;
    deleteOrder(id: string): Promise<void>;
}
