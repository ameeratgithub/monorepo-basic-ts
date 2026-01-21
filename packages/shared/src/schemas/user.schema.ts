import { z } from 'zod';

// =============================================================================
// USER SCHEMAS
// =============================================================================

/**
 * Schema for creating a new user (input from forms/API)
 */
export const CreateUserInputSchema = z.object({
    email: z.string().email('Invalid email address'),
    name: z.string().min(2, 'Name must be at least 2 characters').max(100),
    password: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
        .regex(/[0-9]/, 'Password must contain at least one number'),
});

/**
 * Schema for updating user profile
 */
export const UpdateUserInputSchema = z.object({
    name: z.string().min(2).max(100).optional(),
    email: z.string().email().optional(),
});

/**
 * Schema for user login
 */
export const LoginInputSchema = z.object({
    email: z.string().email('Invalid email address'),
    password: z.string().min(1, 'Password is required'),
});

/**
 * User response schema (sanitized - no password)
 */
export const UserResponseSchema = z.object({
    id: z.string().uuid(),
    email: z.string().email(),
    name: z.string(),
    createdAt: z.coerce.date(),
    updatedAt: z.coerce.date(),
});

/**
 * Auth response with token
 */
export const AuthResponseSchema = z.object({
    user: UserResponseSchema,
    accessToken: z.string(),
});
