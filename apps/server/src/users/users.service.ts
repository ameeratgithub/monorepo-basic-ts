import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import type {
    CreateUserInput,
    UpdateUserInput,
    UserResponse,
    PaginatedResponse,
} from '@repo/shared';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private readonly usersRepository: Repository<User>,
    ) { }

    /**
     * Create a new user
     * @returns UserResponse from shared types
     */
    async create(input: CreateUserInput): Promise<UserResponse> {
        // Check if user already exists
        const existing = await this.usersRepository.findOne({
            where: { email: input.email },
        });
        if (existing) {
            throw new ConflictException('User with this email already exists');
        }

        // In a real app, hash the password here
        const user = this.usersRepository.create({
            ...input,
            password: `hashed_${input.password}`, // Placeholder for bcrypt hashing
        });

        const saved = await this.usersRepository.save(user);
        return saved.toResponse();
    }

    /**
     * Find all users with pagination
     * @returns PaginatedResponse<UserResponse> from shared types
     */
    async findAll(
        page: number = 1,
        pageSize: number = 20,
    ): Promise<PaginatedResponse<UserResponse>> {
        const [users, total] = await this.usersRepository.findAndCount({
            skip: (page - 1) * pageSize,
            take: pageSize,
            order: { createdAt: 'DESC' },
        });

        return {
            items: users.map((user) => user.toResponse()),
            total,
            page,
            pageSize,
            totalPages: Math.ceil(total / pageSize),
        };
    }

    /**
     * Find one user by ID
     * @returns UserResponse from shared types
     */
    async findOne(id: string): Promise<UserResponse> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
        return user.toResponse();
    }

    /**
     * Update a user
     * @returns UserResponse from shared types
     */
    async update(id: string, input: UpdateUserInput): Promise<UserResponse> {
        const user = await this.usersRepository.findOne({ where: { id } });
        if (!user) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }

        // Check email uniqueness if updating email
        if (input.email && input.email !== user.email) {
            const existing = await this.usersRepository.findOne({
                where: { email: input.email },
            });
            if (existing) {
                throw new ConflictException('User with this email already exists');
            }
        }

        Object.assign(user, input);
        const updated = await this.usersRepository.save(user);
        return updated.toResponse();
    }

    /**
     * Delete a user
     */
    async remove(id: string): Promise<void> {
        const result = await this.usersRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`User with ID ${id} not found`);
        }
    }
}
