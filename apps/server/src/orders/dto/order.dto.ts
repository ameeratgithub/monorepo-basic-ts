import { createZodDto } from 'nestjs-zod';
import {
    CreateOrderInputSchema,
    UpdateOrderStatusInputSchema,
    OrderResponseSchema,
} from '@repo/shared';

export class CreateOrderDto extends createZodDto(CreateOrderInputSchema) { }
export class UpdateOrderStatusDto extends createZodDto(UpdateOrderStatusInputSchema) { }
export class OrderResponseDto extends createZodDto(OrderResponseSchema) { }
