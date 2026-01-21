import { z } from 'zod';

// =============================================================================
// PRODUCT SCHEMAS
// =============================================================================

/**
 * Product category enum
 */
export const ProductCategorySchema = z.enum([
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
    'other',
]);

/**
 * Product variant schema (for complex nested forms)
 */
export const ProductVariantSchema = z.object({
    sku: z.string().min(1, 'SKU is required'),
    name: z.string().min(1, 'Variant name is required'),
    price: z.number().positive('Price must be positive'),
    stock: z.number().int().min(0, 'Stock cannot be negative'),
    attributes: z.record(z.string(), z.string()).optional(),
});

/**
 * Product variant response - handles null from database
 */
const ProductVariantResponseBaseSchema = z.object({
    id: z.string().uuid(),
    sku: z.string(),
    name: z.string(),
    price: z.number(),
    stock: z.number(),
    attributes: z.record(z.string(), z.string()).nullable().optional(),
});

/**
 * Schema for creating a product (demonstrates complex nested validation)
 */
export const CreateProductInputSchema = z.object({
    name: z.string().min(2, 'Name must be at least 2 characters').max(200),
    description: z.string().max(2000).optional(),
    category: ProductCategorySchema,
    basePrice: z.number().positive('Price must be positive'),
    variants: z
        .array(ProductVariantSchema)
        .min(1, 'At least one variant is required')
        .max(50, 'Maximum 50 variants allowed'),
    tags: z.array(z.string()).max(20).optional(),
    isActive: z.boolean().default(true),
    metadata: z
        .object({
            brand: z.string().optional(),
            manufacturer: z.string().optional(),
            weight: z.number().positive().optional(),
            dimensions: z
                .object({
                    length: z.number().positive(),
                    width: z.number().positive(),
                    height: z.number().positive(),
                })
                .optional(),
        })
        .optional(),
});

/**
 * Schema for updating a product
 */
export const UpdateProductInputSchema = CreateProductInputSchema.partial();

/**
 * Product variant response
 */
export const ProductVariantResponseSchema = ProductVariantResponseBaseSchema;

/**
 * Product response schema
 */
export const ProductResponseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().nullable(),
    category: ProductCategorySchema,
    basePrice: z.number(),
    variants: z.array(ProductVariantResponseSchema),
    tags: z.array(z.string()),
    isActive: z.boolean(),
    metadata: z.record(z.string(), z.unknown()).nullable(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

/**
 * Paginated products response
 */
export const PaginatedProductsResponseSchema = z.object({
    items: z.array(ProductResponseSchema),
    total: z.number(),
    page: z.number(),
    pageSize: z.number(),
    totalPages: z.number(),
});
