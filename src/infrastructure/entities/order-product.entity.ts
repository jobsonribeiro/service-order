import { Entity, Column, PrimaryGeneratedColumn, ManyToOne } from 'typeorm';
import { Order } from './order.entity';

@Entity()
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    orderId: number;

    @Column()
    productId: number;

    @Column()
    quantity: number;

    @Column()
    price: number;

    @ManyToOne(() => Order, order => order.products)
    order: Order;
}
