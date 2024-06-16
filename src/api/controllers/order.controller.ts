import { Controller, Get, Post, Body, Put, Param, Delete, Inject } from '@nestjs/common';
import { OrderUseCase } from '../../domain/use-cases/order.use-case';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderDto } from '../dto/order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';
import * as sgMail from '@sendgrid/mail';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderUseCase: OrderUseCase,
        @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    ) { 
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

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

    @MessagePattern('order_finish')
    async setOrderFinish(@Payload() data: number[], @Ctx() context: RmqContext) {
        const { content } = context.getMessage();

        const decodedContent = Buffer.from(content, 'base64').toString('utf-8');
        const requestBodyObject = JSON.parse(decodedContent);
        //await this.sendEmailNotification(paymentInfo.payer.email, paymentInfo.status);
        return this.orderUseCase.updateOrderStatus(requestBodyObject.data.orderId, 'finish');
    }

    @Get('preparation')
    async findOrdersInPreparation() {
        return this.orderUseCase.findOrdersByStatus();
    }

    private async sendEmailNotification(email: string): Promise<void> {

        const subject = 'Seu pagamento foi aprovado!';
        const text = 'Obrigado por seu pagamento. Seu pedido está sendo processado.';
        
        const msg = {
            to: email || "jobson.analistati@gmail.com",
            from: 'projetofiapfoodie@gmail.com', // Use the email you registered with SendGrid
            subject: subject,
            text: text,
        };

        try {
            await sgMail.send(msg);
            console.log('Email enviado com sucesso');
        } catch (error) {
            console.error('Erro ao enviar email:', error);
        }
    }
}
