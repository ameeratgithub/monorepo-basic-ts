// User schemas
export {
    CreateUserInputSchema,
    UpdateUserInputSchema,
    LoginInputSchema,
    UserResponseSchema,
    AuthResponseSchema,
} from './user.schema.js';

// Product schemas
export {
    ProductCategorySchema,
    ProductVariantSchema,
    CreateProductInputSchema,
    UpdateProductInputSchema,
    ProductVariantResponseSchema,
    ProductResponseSchema,
    PaginatedProductsResponseSchema,
} from './product.schema.js';

// Order schemas
export {
    OrderStatusSchema,
    AddressSchema,
    OrderItemInputSchema,
    CreateOrderInputSchema,
    OrderItemResponseSchema,
    OrderResponseSchema,
    UpdateOrderStatusInputSchema,
} from './order.schema.js';

// Common schemas
export {
    PaginationQuerySchema,
    IdParamSchema,
    SearchQuerySchema,
    createPaginatedResponseSchema,
    ApiErrorResponseSchema,
    ApiSuccessResponseSchema,
} from './common.schema.js';
