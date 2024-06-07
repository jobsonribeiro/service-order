import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToMany } from 'typeorm';
import { OrderProduct } from './order-product.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column('text')
    description: string;

    @Column('decimal', { precision: 10, scale: 2 })
    price: number;

    @Column({
        type: 'enum',
        enum: ['lanche', 'acompanhamento', 'bebida'],
    })
    category: 'lanche' | 'acompanhamento' | 'bebida';

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @ManyToMany(() => OrderProduct, (orderProduct) => orderProduct.productId)
    orderProducts: OrderProduct[];
}
