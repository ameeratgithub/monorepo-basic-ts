import type { z } from 'zod';

// Import schemas
import type {
    // User
    CreateUserInputSchema,
    UpdateUserInputSchema,
    LoginInputSchema,
    UserResponseSchema,
    AuthResponseSchema,
    // Product
    ProductCategorySchema,
    ProductVariantSchema,
    CreateProductInputSchema,
    UpdateProductInputSchema,
    ProductVariantResponseSchema,
    ProductResponseSchema,
    PaginatedProductsResponseSchema,
    // Order
    OrderStatusSchema,
    AddressSchema,
    OrderItemInputSchema,
    CreateOrderInputSchema,
    OrderItemResponseSchema,
    OrderResponseSchema,
    UpdateOrderStatusInputSchema,
    // Common
    PaginationQuerySchema,
    IdParamSchema,
    SearchQuerySchema,
    ApiErrorResponseSchema,
} from '../schemas/index.js';

// =============================================================================
// USER TYPES
// =============================================================================
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;
export type UpdateUserInput = z.infer<typeof UpdateUserInputSchema>;
export type LoginInput = z.infer<typeof LoginInputSchema>;
export type UserResponse = z.infer<typeof UserResponseSchema>;
export type AuthResponse = z.infer<typeof AuthResponseSchema>;

// =============================================================================
// PRODUCT TYPES
// =============================================================================
export type ProductCategory = z.infer<typeof ProductCategorySchema>;
export type ProductVariant = z.infer<typeof ProductVariantSchema>;
export type CreateProductInput = z.infer<typeof CreateProductInputSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductInputSchema>;
export type ProductVariantResponse = z.infer<typeof ProductVariantResponseSchema>;
export type ProductResponse = z.infer<typeof ProductResponseSchema>;
export type PaginatedProductsResponse = z.infer<typeof PaginatedProductsResponseSchema>;

// =============================================================================
// ORDER TYPES
// =============================================================================
export type OrderStatus = z.infer<typeof OrderStatusSchema>;
export type Address = z.infer<typeof AddressSchema>;
export type OrderItemInput = z.infer<typeof OrderItemInputSchema>;
export type CreateOrderInput = z.infer<typeof CreateOrderInputSchema>;
export type OrderItemResponse = z.infer<typeof OrderItemResponseSchema>;
export type OrderResponse = z.infer<typeof OrderResponseSchema>;
export type UpdateOrderStatusInput = z.infer<typeof UpdateOrderStatusInputSchema>;

// =============================================================================
// COMMON TYPES
// =============================================================================
export type PaginationQuery = z.infer<typeof PaginationQuerySchema>;
export type IdParam = z.infer<typeof IdParamSchema>;
export type SearchQuery = z.infer<typeof SearchQuerySchema>;
export type ApiErrorResponse = z.infer<typeof ApiErrorResponseSchema>;

// Generic paginated response type
export interface PaginatedResponse<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}
