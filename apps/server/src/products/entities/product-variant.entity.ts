import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ProductVariantResponseSchema, type ProductVariantResponse } from '@repo/shared';
import { Product } from './product.entity';

@Entity('product_variants')
export class ProductVariant {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    sku: string;

    @Column()
    name: string;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    price: number;

    @Column({ type: 'int' })
    stock: number;

    @Column({ type: 'jsonb', nullable: true })
    attributes: Record<string, string> | null;

    @ManyToOne(() => Product, (product) => product.variants, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'productId' })
    product: Product;

    @Column()
    productId: string;

    toResponse(): ProductVariantResponse {
        return ProductVariantResponseSchema.parse({
            id: this.id,
            sku: this.sku,
            name: this.name,
            price: Number(this.price),
            stock: this.stock,
            attributes: this.attributes,
        });
    }
}
