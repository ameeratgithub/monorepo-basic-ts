import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { OrderResponseSchema, type OrderResponse, type Address } from '@repo/shared';
import { OrderItem } from './order-item.entity';

@Entity('orders')
export class Order {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    orderNumber: string;

    @Column({ default: 'pending' })
    status: string;

    @OneToMany(() => OrderItem, (item) => item.order, { cascade: true, eager: true })
    items: OrderItem[];

    @Column({ type: 'jsonb' })
    shippingAddress: Address;

    @Column({ type: 'jsonb', nullable: true })
    billingAddress: Address | null;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    subtotal: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    discount: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
    tax: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    total: number;

    @Column({ type: 'text', nullable: true })
    notes: string | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toResponse(): OrderResponse {
        return OrderResponseSchema.parse({
            id: this.id,
            orderNumber: this.orderNumber,
            status: this.status,
            items: this.items.map((item) => item.toResponse()),
            shippingAddress: this.shippingAddress,
            billingAddress: this.billingAddress,
            subtotal: Number(this.subtotal),
            discount: Number(this.discount),
            tax: Number(this.tax),
            total: Number(this.total),
            notes: this.notes,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }
}
