import { Controller, Get, Post, Body, Put, Param, Delete, Inject } from '@nestjs/common';
import { OrderUseCase } from '../../domain/use-cases/order.use-case';
import { ClientProxy } from '@nestjs/microservices';
import { OrderDto } from '../dto/order.dto';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderUseCase: OrderUseCase,
        @Inject('RABBITMQ_SERVICE') private client: ClientProxy,) { }

    @Post()
    create(@Body() orderDto: OrderDto) {
        const order =  this.orderUseCase.createOrder(orderDto);
        this.client.emit('order_created', order);
        return order;
    }

    @Get()
    findAll() {
        return this.orderUseCase.findAllOrders();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.orderUseCase.findOrderById(id);
    }

    @Put(':id')
    update(@Param('id') id: string, @Body() orderDto: OrderDto) {
        return this.orderUseCase.updateOrder(id, orderDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.orderUseCase.deleteOrder(id);
    }
}
