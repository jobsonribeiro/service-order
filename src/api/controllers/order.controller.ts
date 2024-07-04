import { Controller, Get, Post, Body, Put, Param, Delete, Inject, UsePipes } from '@nestjs/common';
import { OrderUseCase } from '../../domain/use-cases/order.use-case';
import { ClientProxy, Ctx, MessagePattern, Payload, RmqContext } from '@nestjs/microservices';
import { OrderDto } from '../dto/order.dto';
import { OrderEntity } from '../../domain/entities/order.entity';
import * as sgMail from '@sendgrid/mail';
import { SanitizePipe } from '../../pipes/sanitize.pipe';

@Controller('orders')
export class OrderController {
    constructor(private readonly orderUseCase: OrderUseCase,
        @Inject('RABBITMQ_SERVICE') private client: ClientProxy,
    ) { 
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);
    }

    @UsePipes(new SanitizePipe())
    @Post()
    async create(@Body() orderDto: OrderDto): Promise<OrderEntity> {
        const order = await this.orderUseCase.createOrder(orderDto);
        this.client.emit('order_created', order);
        return order;
    }

    @Get()
    @UsePipes(new SanitizePipe())
    findAll() {
        return this.orderUseCase.findAllOrders();
    }

    @Put(':id')
    @UsePipes(new SanitizePipe())
    update(@Param('id') id: string, @Body() orderDto: OrderDto) {
        return this.orderUseCase.updateOrder(id, orderDto);
    }

    @Delete(':id')
    @UsePipes(new SanitizePipe())
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
    @UsePipes(new SanitizePipe())
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
