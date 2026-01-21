import type {
    CreateUserInput,
    UserResponse,
    CreateProductInput,
    ProductResponse,
    CreateOrderInput,
    OrderResponse,
    PaginatedResponse,
} from '@repo/shared';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

class ApiError extends Error {
    constructor(
        public statusCode: number,
        message: string,
        public details?: Array<{ field: string; message: string }>
    ) {
        super(message);
        this.name = 'ApiError';
    }
}

async function handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: 'Unknown error' }));
        throw new ApiError(
            response.status,
            error.message || `HTTP ${response.status}`,
            error.details
        );
    }
    return response.json();
}

// =============================================================================
// USERS API
// =============================================================================

export const usersApi = {
    create: async (data: CreateUserInput): Promise<UserResponse> => {
        const response = await fetch(`${API_BASE_URL}/users`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<UserResponse>(response);
    },

    getAll: async (page = 1, pageSize = 20): Promise<PaginatedResponse<UserResponse>> => {
        const response = await fetch(
            `${API_BASE_URL}/users?page=${page}&pageSize=${pageSize}`
        );
        return handleResponse<PaginatedResponse<UserResponse>>(response);
    },

    getById: async (id: string): Promise<UserResponse> => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`);
        return handleResponse<UserResponse>(response);
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/users/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new ApiError(response.status, error.message);
        }
    },
};

// =============================================================================
// PRODUCTS API
// =============================================================================

export const productsApi = {
    create: async (data: CreateProductInput): Promise<ProductResponse> => {
        const response = await fetch(`${API_BASE_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<ProductResponse>(response);
    },

    getAll: async (page = 1, pageSize = 20): Promise<PaginatedResponse<ProductResponse>> => {
        const response = await fetch(
            `${API_BASE_URL}/products?page=${page}&pageSize=${pageSize}`
        );
        return handleResponse<PaginatedResponse<ProductResponse>>(response);
    },

    getById: async (id: string): Promise<ProductResponse> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`);
        return handleResponse<ProductResponse>(response);
    },

    delete: async (id: string): Promise<void> => {
        const response = await fetch(`${API_BASE_URL}/products/${id}`, {
            method: 'DELETE',
        });
        if (!response.ok) {
            const error = await response.json().catch(() => ({ message: 'Unknown error' }));
            throw new ApiError(response.status, error.message);
        }
    },
};

// =============================================================================
// ORDERS API
// =============================================================================

export const ordersApi = {
    create: async (data: CreateOrderInput): Promise<OrderResponse> => {
        const response = await fetch(`${API_BASE_URL}/orders`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });
        return handleResponse<OrderResponse>(response);
    },

    getAll: async (page = 1, pageSize = 20): Promise<PaginatedResponse<OrderResponse>> => {
        const response = await fetch(
            `${API_BASE_URL}/orders?page=${page}&pageSize=${pageSize}`
        );
        return handleResponse<PaginatedResponse<OrderResponse>>(response);
    },

    getById: async (id: string): Promise<OrderResponse> => {
        const response = await fetch(`${API_BASE_URL}/orders/${id}`);
        return handleResponse<OrderResponse>(response);
    },
};

export { ApiError };
