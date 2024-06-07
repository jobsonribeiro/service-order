import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IOrderPort } from '../../domain/ports/order.port';
import { OrderDto } from '../../api/dto/order.dto';
import { Order } from '../entities/order.entity';
import { OrderProduct } from '../entities/order-product.entity';

@Injectable()
export class OrderAdapter implements IOrderPort {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderProduct)
        private readonly orderProductRepository: Repository<OrderProduct>,
    ) { }

    async createOrder(orderDto: OrderDto): Promise<any> {
        const { clientId, status, products } = orderDto;
        const order = this.orderRepository.create({ clientId, status });
        const savedOrder = await this.orderRepository.save(order);

        const orderProducts = products.map(product => {
            return this.orderProductRepository.create({
                orderId: savedOrder.id,
                productId: product.id,
                quantity: product.quantity,
            });
        });

        await this.orderProductRepository.save(orderProducts);

        return savedOrder;
    }

    async findAllOrders(): Promise<any[]> {
        return this.orderRepository.find({ relations: ['products'] });
    }

    async findOrderById(id: string): Promise<any> {
        return this.orderRepository.findOne({
            where: { id: Number(id) },
            relations: ['products'],
        });
    }

    async updateOrder(id: string, orderDto: OrderDto): Promise<any> {
        const { clientId, status, products } = orderDto;
        await this.orderRepository.update(id, { clientId, status });

        await this.orderProductRepository.delete({ orderId: Number(id) });
        const orderProducts = products.map(product => {
            return this.orderProductRepository.create({
                orderId: Number(id),
                productId: product.id,
                quantity: product.quantity,
            });
        });

        await this.orderProductRepository.save(orderProducts);

        return this.orderRepository.findOne({
            where: { id: Number(id) },
            relations: ['products'],
        });
    }

    async deleteOrder(id: string): Promise<void> {
        await this.orderProductRepository.delete({ orderId: Number(id) });
        await this.orderRepository.delete(id);
    }
}
