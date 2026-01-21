import { createZodDto } from 'nestjs-zod';
import {
    CreateProductInputSchema,
    UpdateProductInputSchema,
    ProductResponseSchema,
    PaginatedProductsResponseSchema,
} from '@repo/shared';

export class CreateProductDto extends createZodDto(CreateProductInputSchema) { }
export class UpdateProductDto extends createZodDto(UpdateProductInputSchema) { }
export class ProductResponseDto extends createZodDto(ProductResponseSchema) { }
export class PaginatedProductsResponseDto extends createZodDto(
    PaginatedProductsResponseSchema,
) { }
