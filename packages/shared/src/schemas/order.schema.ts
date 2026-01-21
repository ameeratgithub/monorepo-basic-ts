import { z } from 'zod';

// =============================================================================
// ORDER SCHEMAS (Complex example with multiple entities)
// =============================================================================

/**
 * Order status enum
 */
export const OrderStatusSchema = z.enum([
    'pending',
    'confirmed',
    'processing',
    'shipped',
    'delivered',
    'cancelled',
]);

/**
 * Address schema (reusable across forms)
 */
export const AddressSchema = z.object({
    street: z.string().min(1, 'Street is required'),
    city: z.string().min(1, 'City is required'),
    state: z.string().min(1, 'State is required'),
    postalCode: z.string().min(1, 'Postal code is required'),
    country: z.string().min(2).max(2, 'Use 2-letter country code'),
});

/**
 * Order item input
 */
export const OrderItemInputSchema = z.object({
    productId: z.string().uuid('Invalid product ID'),
    variantId: z.string().uuid('Invalid variant ID'),
    quantity: z.number().int().positive('Quantity must be at least 1'),
});

/**
 * Create order input schema
 */
export const CreateOrderInputSchema = z.object({
    items: z.array(OrderItemInputSchema).min(1, 'Order must have at least one item'),
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema.optional(),
    useSameAddress: z.boolean().default(true),
    notes: z.string().max(500).optional(),
    couponCode: z.string().optional(),
});

/**
 * Order item response
 */
export const OrderItemResponseSchema = z.object({
    id: z.string().uuid(),
    productId: z.string().uuid(),
    productName: z.string(),
    variantId: z.string().uuid(),
    variantName: z.string(),
    quantity: z.number(),
    unitPrice: z.number(),
    totalPrice: z.number(),
});

/**
 * Order response schema
 */
export const OrderResponseSchema = z.object({
    id: z.string().uuid(),
    orderNumber: z.string(),
    status: OrderStatusSchema,
    items: z.array(OrderItemResponseSchema),
    shippingAddress: AddressSchema,
    billingAddress: AddressSchema.nullable(),
    subtotal: z.number(),
    discount: z.number(),
    tax: z.number(),
    total: z.number(),
    notes: z.string().nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

/**
 * Update order status input
 */
export const UpdateOrderStatusInputSchema = z.object({
    status: OrderStatusSchema,
    notes: z.string().max(500).optional(),
});
