import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { OrderProduct } from './order-product.entity';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    clientId: number;

    @Column()
    status: string;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
    products: OrderProduct[];
}
