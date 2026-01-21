import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
    CreateProductInput,
    UpdateProductInput,
    ProductResponse,
    PaginatedProductsResponse,
} from '@repo/shared';
import { Product } from './entities/product.entity';
import { ProductVariant } from './entities/product-variant.entity';

@Injectable()
export class ProductsService {
    constructor(
        @InjectRepository(Product)
        private readonly productsRepository: Repository<Product>,
        @InjectRepository(ProductVariant)
        private readonly variantsRepository: Repository<ProductVariant>,
    ) { }

    async create(input: CreateProductInput): Promise<ProductResponse> {
        // Create variants entities
        const variants = input.variants.map((v) =>
            this.variantsRepository.create({
                sku: v.sku,
                name: v.name,
                price: v.price,
                stock: v.stock,
                attributes: v.attributes || null,
            }),
        );

        const product = this.productsRepository.create({
            name: input.name,
            description: input.description || null,
            category: input.category,
            basePrice: input.basePrice,
            variants,
            tags: input.tags || [],
            isActive: input.isActive ?? true,
            metadata: input.metadata || null,
        });

        const saved = await this.productsRepository.save(product);
        return saved.toResponse();
    }

    async findAll(
        page: number = 1,
        pageSize: number = 20,
    ): Promise<PaginatedProductsResponse> {
        const [products, total] = await this.productsRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });

        return {
            items: products.map((p) => p.toResponse()),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    async findOne(id: string): Promise<ProductResponse> {
        const product = await this.productsRepository.findOne({ where: { id } });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
        return product.toResponse();
    }

    async update(id: string, input: UpdateProductInput): Promise<ProductResponse> {
        const product = await this.productsRepository.findOne({
            where: { id },
            relations: ['variants'],
        });
        if (!product) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        // Update simple fields
        if (input.name !== undefined) product.name = input.name;
        if (input.description !== undefined) product.description = input.description || null;
        if (input.category !== undefined) product.category = input.category;
        if (input.basePrice !== undefined) product.basePrice = input.basePrice;
        if (input.tags !== undefined) product.tags = input.tags || [];
        if (input.isActive !== undefined) product.isActive = input.isActive;
        if (input.metadata !== undefined) product.metadata = input.metadata || null;

        // Handle variants update if provided
        if (input.variants !== undefined) {
            // Delete old variants and create new ones
            await this.variantsRepository.delete({ productId: id });
            product.variants = input.variants.map((v) =>
                this.variantsRepository.create({
                    sku: v.sku,
                    name: v.name,
                    price: v.price,
                    stock: v.stock,
                    attributes: v.attributes || null,
                }),
            );
        }

        const updated = await this.productsRepository.save(product);
        return updated.toResponse();
    }

    async remove(id: string): Promise<void> {
        const result = await this.productsRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }
    }
}
