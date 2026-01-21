import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { UserResponseSchema, type UserResponse } from '@repo/shared';

/**
 * User entity - database model
 * Decoupled from Zod schemas but uses toResponse() to convert to shared types
 */
@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true })
    email: string;

    @Column()
    name: string;

    @Column()
    password: string; // Hashed, never exposed in response

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    /**
     * Convert entity to response type (sanitized, validated)
     * Uses the shared schema to ensure consistency
     */
    toResponse(): UserResponse {
        return UserResponseSchema.parse({
            id: this.id,
            email: this.email,
            name: this.name,
            createdAt: this.createdAt,
            updatedAt: this.updatedAt,
        });
    }
}
