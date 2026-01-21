import { z } from 'zod';

// =============================================================================
// COMMON / UTILITY SCHEMAS
// =============================================================================

/**
 * Pagination query params
 */
export const PaginationQuerySchema = z.object({
    page: z.coerce.number().int().positive().default(1),
    pageSize: z.coerce.number().int().min(1).max(100).default(20),
});

/**
 * Generic ID param schema
 */
export const IdParamSchema = z.object({
    id: z.string().uuid('Invalid ID format'),
});

/**
 * Search query schema
 */
export const SearchQuerySchema = z.object({
    q: z.string().min(1).max(100).optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).default('asc'),
});

/**
 * Generic paginated response helper
 */
export const createPaginatedResponseSchema = <T extends z.ZodTypeAny>(itemSchema: T) =>
    z.object({
        items: z.array(itemSchema),
        total: z.number(),
        page: z.number(),
        pageSize: z.number(),
        totalPages: z.number(),
    });

/**
 * API error response schema
 */
export const ApiErrorResponseSchema = z.object({
    statusCode: z.number(),
    message: z.string(),
    error: z.string().optional(),
    details: z.array(z.object({
        field: z.string(),
        message: z.string(),
    })).optional(),
});

/**
 * Success response wrapper
 */
export const ApiSuccessResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
    z.object({
        success: z.literal(true),
        data: dataSchema,
    });
