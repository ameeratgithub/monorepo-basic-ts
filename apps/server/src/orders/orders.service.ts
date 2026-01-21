import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
    CreateOrderInput,
    UpdateOrderStatusInput,
    OrderResponse,
    PaginatedResponse,
} from '@repo/shared';
import { Order } from './entities/order.entity';
import { OrderItem } from './entities/order-item.entity';

@Injectable()
export class OrdersService {
    constructor(
        @InjectRepository(Order)
        private readonly ordersRepository: Repository<Order>,
        @InjectRepository(OrderItem)
        private readonly orderItemsRepository: Repository<OrderItem>,
    ) { }

    private generateOrderNumber(): string {
        const timestamp = Date.now().toString(36).toUpperCase();
        const random = Math.random().toString(36).substring(2, 8).toUpperCase();
        return `ORD-${timestamp}-${random}`;
    }

    async create(input: CreateOrderInput): Promise<OrderResponse> {
        // In a real app, fetch product/variant details and calculate prices
        const items = input.items.map((item) =>
            this.orderItemsRepository.create({
                productId: item.productId,
                productName: 'Sample Product', // Fetch from products service
                variantId: item.variantId,
                variantName: 'Default Variant', // Fetch from products service
                quantity: item.quantity,
                unitPrice: 99.99, // Fetch from products service
                totalPrice: 99.99 * item.quantity,
            }),
        );

        const subtotal = items.reduce((sum, item) => sum + Number(item.totalPrice), 0);
        const tax = subtotal * 0.1; // 10% tax
        const total = subtotal + tax;

        const order = this.ordersRepository.create({
            orderNumber: this.generateOrderNumber(),
            status: 'pending',
            items,
            shippingAddress: input.shippingAddress,
            billingAddress: input.useSameAddress ? null : input.billingAddress || null,
            subtotal,
            discount: 0,
            tax,
            total,
            notes: input.notes || null,
        });

        const saved = await this.ordersRepository.save(order);
        return saved.toResponse();
    }

    async findAll(
        page: number = 1,
        pageSize: number = 20,
    ): Promise<PaginatedResponse<OrderResponse>> {
        const [orders, total] = await this.ordersRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });

        return {
            items: orders.map((o) => o.toResponse()),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async findOne(id: string): Promise<OrderResponse> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }
        return order.toResponse();
    }

    async updateStatus(id: string, input: UpdateOrderStatusInput): Promise<OrderResponse> {
        const order = await this.ordersRepository.findOne({ where: { id } });
        if (!order) {
            throw new NotFoundException(`Order with ID ${id} not found`);
        }

        order.status = input.status;
        if (input.notes) {
            order.notes = order.notes
                ? `${order.notes}\n---\n${input.notes}`
                : input.notes;
        }

        const updated = await this.ordersRepository.save(order);
        return updated.toResponse();
    }
}
