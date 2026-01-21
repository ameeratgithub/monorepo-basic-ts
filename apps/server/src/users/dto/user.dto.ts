import { createZodDto } from 'nestjs-zod';
import {
    CreateUserInputSchema,
    UpdateUserInputSchema,
    LoginInputSchema,
    UserResponseSchema,
    AuthResponseSchema,
    PaginationQuerySchema,
} from '@repo/shared';

// =============================================================================
// REQUEST DTOs (Input)
// =============================================================================

/**
 * Create user DTO - automatically validated by ZodValidationPipe
 * Swagger docs generated from schema
 */
export class CreateUserDto extends createZodDto(CreateUserInputSchema) { }

/**
 * Update user DTO
 */
export class UpdateUserDto extends createZodDto(UpdateUserInputSchema) { }

/**
 * Login DTO
 */
export class LoginDto extends createZodDto(LoginInputSchema) { }

/**
 * Pagination query DTO
 */
export class PaginationQueryDto extends createZodDto(PaginationQuerySchema) { }

// =============================================================================
// RESPONSE DTOs (Output)
// =============================================================================

/**
 * User response DTO - for Swagger docs
 */
export class UserResponseDto extends createZodDto(UserResponseSchema) { }

/**
 * Auth response DTO
 */
export class AuthResponseDto extends createZodDto(AuthResponseSchema) { }
