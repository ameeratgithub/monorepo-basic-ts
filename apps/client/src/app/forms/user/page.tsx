'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ArrowLeft, Loader2 } from 'lucide-react';

// Import shared schema and type from @repo/shared
import { CreateUserInputSchema, type CreateUserInput, type UserResponse } from '@repo/shared';

// Import API client
import { usersApi, ApiError } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';

export default function UserFormPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdUser, setCreatedUser] = useState<UserResponse | null>(null);

    // Type-safe form using shared schema
    const form = useForm<CreateUserInput>({
        resolver: zodResolver(CreateUserInputSchema),
        defaultValues: {
            email: '',
            name: '',
            password: '',
        },
    });

    async function onSubmit(data: CreateUserInput) {
        setIsSubmitting(true);
        setCreatedUser(null);

        try {
            // Call backend API
            const user = await usersApi.create(data);
            setCreatedUser(user);

            toast({
                title: '✅ User created successfully!',
                description: `Created user: ${user.name} (${user.email})`,
            });

            form.reset();
        } catch (error) {
            if (error instanceof ApiError) {
                toast({
                    title: '❌ Error creating user',
                    description: error.message,
                    variant: 'destructive',
                });
            } else {
                toast({
                    title: '❌ Network error',
                    description: 'Could not connect to the server. Is the backend running?',
                    variant: 'destructive',
                });
            }
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <div className="container py-10">
            <div className="mx-auto max-w-lg space-y-6">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle>User Registration Form</CardTitle>
                        <CardDescription>
                            This form calls <code className="bg-muted px-1 rounded">POST /users</code> on the backend
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                <FormField
                                    control={form.control}
                                    name="email"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Email</FormLabel>
                                            <FormControl>
                                                <Input placeholder="user@example.com" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormDescription>
                                                Must be a valid email address
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Name</FormLabel>
                                            <FormControl>
                                                <Input placeholder="John Doe" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormDescription>
                                                2-100 characters
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Password</FormLabel>
                                            <FormControl>
                                                <Input type="password" placeholder="••••••••" {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormDescription>
                                                Min 8 chars, 1 uppercase, 1 lowercase, 1 number
                                            </FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Register User'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Success Response Display */}
                {createdUser && (
                    <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                        <CardHeader>
                            <CardTitle className="text-lg text-green-700 dark:text-green-300">
                                ✅ User Created
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs overflow-x-auto bg-white dark:bg-slate-950 p-4 rounded-md">
                                {JSON.stringify(createdUser, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}

                {/* Schema Preview */}
                <Card className="bg-slate-950 text-white">
                    <CardHeader>
                        <CardTitle className="text-sm font-mono">API: POST /users</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <pre className="text-xs overflow-x-auto">
                            {`// Request body validated by shared Zod schema
{
  "email": "user@example.com",
  "name": "John Doe",
  "password": "SecurePass123"
}

// Response uses UserResponse type
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "John Doe",
  "createdAt": "2024-01-21T...",
  "updatedAt": "2024-01-21T..."
}`}
                        </pre>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
