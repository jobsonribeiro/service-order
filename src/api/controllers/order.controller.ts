import { Controller, Get, Post, Body, Put, Param, Delete, Inject } from '@nestjs/common';
import { OrderUseCase } from '../../domain/use-cases/order.use-case';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderDto } from '../dto/order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderUseCase: OrderUseCase,
        @Inject('RABBITMQ_SERVICE') private client: ClientProxy,) { }

    @Post()
    async create(@Body() orderDto: OrderDto): Promise<OrderEntity> {
        const order = await this.orderUseCase.createOrder(orderDto);
        this.client.emit('order_created', order);
        return order;
    }

    @Get()
    findAll() {
        return this.orderUseCase.findAllOrders();
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() orderDto: OrderDto) {
        return this.orderUseCase.updateOrder(id, orderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderUseCase.deleteOrder(id);
    }

    @MessagePattern('payment_confirm')
    async getNotifications(@Payload() data: number[], @Ctx() context: RmqContext) {
        const { content } = context.getMessage();

        const decodedContent = Buffer.from(content, 'base64').toString('utf-8');
        const requestBodyObject = JSON.parse(decodedContent);
         
        return this.orderUseCase.updateOrderStatus(requestBodyObject.data.orderId, 'preparation');
    }

    @Get('preparation')
    async findOrdersInPreparation() {
        return this.orderUseCase.findOrdersByStatus();
    }
}
