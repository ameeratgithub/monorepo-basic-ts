import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ProductResponseSchema, type ProductResponse } from '@repo/shared';
import { ProductVariant } from './product-variant.entity';

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ type: 'text', nullable: true })
    description: string | null;

    @Column()
    category: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    basePrice: number;

    @OneToMany(() => ProductVariant, (variant) => variant.product, {
        cascade: true,
        eager: true,
    })
    variants: ProductVariant[];

    @Column({ type: 'simple-array', default: '' })
    tags: string[];

    @Column({ default: true })
    isActive: boolean;

    @Column({ type: 'jsonb', nullable: true })
    metadata: Record<string, unknown> | null;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    toResponse(): ProductResponse {
        return ProductResponseSchema.parse({
            id: this.id,
            name: this.name,
            description: this.description,
            category: this.category,
            basePrice: Number(this.basePrice),
            variants: this.variants.map((v) => v.toResponse()),
            tags: this.tags || [],
            isActive: this.isActive,
            metadata: this.metadata,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }
}
