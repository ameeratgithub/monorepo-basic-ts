import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { OrderItemResponseSchema, type OrderItemResponse } from '@repo/shared';
import { Order } from './order.entity';

@Entity('order_items')
export class OrderItem {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column('uuid')
    productId: string;

    @Column()
    productName: string;

    @Column('uuid')
    variantId: string;

    @Column()
    variantName: string;

    @Column({ type: 'int' })
    quantity: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    unitPrice: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    totalPrice: number;

    @ManyToOne(() => Order, (order) => order.items, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'orderId' })
    order: Order;

    @Column()
    orderId: string;

    toResponse(): OrderItemResponse {
        return OrderItemResponseSchema.parse({
            id: this.id,
            productId: this.productId,
            productName: this.productName,
            variantId: this.variantId,
            variantName: this.variantName,
            quantity: this.quantity,
            unitPrice: Number(this.unitPrice),
            totalPrice: Number(this.totalPrice),
        });
    }
}
