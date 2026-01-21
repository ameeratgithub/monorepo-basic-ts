'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

// Import types directly from shared package to demonstrate type sharing
import type {
    CreateUserInput,
    UserResponse,
    CreateProductInput,
    ProductResponse,
    CreateOrderInput,
    OrderResponse,
} from '@repo/shared';

export default function DemoPage() {
    // Type-safe objects - any mistakes here will cause TypeScript errors
    const exampleUser: CreateUserInput = {
        email: 'user@example.com',
        name: 'John Doe',
        password: 'SecurePass123',
    };

    const exampleUserResponse: UserResponse = {
        id: '550e8400-e29b-41d4-a716-446655440000',
        email: 'user@example.com',
        name: 'John Doe',
        createdAt: new Date(),
        updatedAt: new Date(),
    };

    return (
        <div className="container py-10">
            <div className="mx-auto max-w-4xl space-y-6">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <div className="text-center space-y-4">
                    <h1 className="text-3xl font-bold">Shared Types Demo</h1>
                    <p className="text-muted-foreground">
                        See how types flow from @repo/shared to the frontend
                    </p>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Input Type (for forms)</CardTitle>
                            <CardDescription>CreateUserInput</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs bg-slate-950 text-white p-4 rounded-md overflow-x-auto">
                                {`type CreateUserInput = {
  email: string;
  name: string;
  password: string;
}

// Example:
${JSON.stringify(exampleUser, null, 2)}`}
                            </pre>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-lg">Response Type (from API)</CardTitle>
                            <CardDescription>UserResponse (no password!)</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs bg-slate-950 text-white p-4 rounded-md overflow-x-auto">
                                {`type UserResponse = {
  id: string;
  email: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  // Note: password is NOT included
}

// Example response:
${JSON.stringify(exampleUserResponse, null, 2)}`}
                            </pre>
                        </CardContent>
                    </Card>
                </div>

                <Card className="bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-0">
                    <CardContent className="pt-6">
                        <h3 className="font-semibold text-lg mb-4">✅ How it works</h3>
                        <div className="grid gap-6 md:grid-cols-3">
                            <div className="space-y-2">
                                <p className="font-medium">1. Define Once</p>
                                <p className="text-sm text-muted-foreground">
                                    Zod schemas in <code className="bg-muted px-1 rounded">@repo/shared</code>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">2. Infer Types</p>
                                <p className="text-sm text-muted-foreground">
                                    <code className="bg-muted px-1 rounded">z.infer&lt;typeof Schema&gt;</code>
                                </p>
                            </div>
                            <div className="space-y-2">
                                <p className="font-medium">3. Use Everywhere</p>
                                <p className="text-sm text-muted-foreground">
                                    Same types in frontend, backend, and Swagger
                                </p>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Type Safety Flow</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs bg-slate-950 text-white p-4 rounded-md overflow-x-auto">
                            {`// @repo/shared/src/schemas/user.schema.ts
export const CreateUserInputSchema = z.object({
  email: z.string().email(),
  name: z.string().min(2),
  password: z.string().min(8),
});

// @repo/shared/src/types/index.ts
export type CreateUserInput = z.infer<typeof CreateUserInputSchema>;

// apps/client - Form with full type safety
const form = useForm<CreateUserInput>({
  resolver: zodResolver(CreateUserInputSchema),
});

// apps/server - DTO from same schema
class CreateUserDto extends createZodDto(CreateUserInputSchema) {}

// Result: ONE source of truth, ZERO type duplication`}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
