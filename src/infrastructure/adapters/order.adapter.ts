import { Injectable } from '@nestjs/common';
import { InjectDataSource, InjectRepository } from '@nestjs/typeorm';
import { DataSource, Repository } from 'typeorm';
import { IOrderPort } from '../../domain/ports/order.port';
import { OrderDto } from '../../api/dto/order.dto';
import { Order } from '../entities/order.entity';
import { OrderProduct } from '../entities/order-product.entity';
import { OrderEntity } from '../../domain/entities/order.entity';

@Injectable()
export class OrderAdapter implements IOrderPort {
    constructor(
        @InjectRepository(Order)
        private readonly orderRepository: Repository<Order>,
        @InjectRepository(OrderProduct)
        private readonly orderProductRepository: Repository<OrderProduct>,
        @InjectDataSource() private dataSource: DataSource,
    ) { }

    async createOrder(orderDto: OrderDto): Promise<OrderEntity> {
        const { clientId, status, products } = orderDto;
        const order = this.orderRepository.create({ clientId, status });
        const savedOrder = await this.orderRepository.save(order);

        const orderProducts = products.map(product => {
            return this.orderProductRepository.create({
                orderId: savedOrder.id,
                productId: product.id,
                quantity: product.quantity,
                price: product.price,
            });
        });

        await this.orderProductRepository.save(orderProducts);
        savedOrder.products = orderProducts;
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

    async findOrdersByStatus(): Promise<any[]> {
        const status = "preparation";
        const orders = await this.orderRepository.find({
            where: { status },
            relations: ['products'],
        });
        return orders;
    }
}
