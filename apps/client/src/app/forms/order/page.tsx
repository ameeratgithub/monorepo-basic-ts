'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';

// Import shared schema and type from @repo/shared
import { CreateOrderInputSchema, type CreateOrderInput, type OrderResponse } from '@repo/shared';

// Import API client
import { ordersApi, ApiError } from '@/lib/api';

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

// Sample product IDs for demo
const sampleProducts = [
    { id: '550e8400-e29b-41d4-a716-446655440001', variantId: '550e8400-e29b-41d4-a716-446655440011', name: 'iPhone 15 Pro - 256GB Black' },
    { id: '550e8400-e29b-41d4-a716-446655440002', variantId: '550e8400-e29b-41d4-a716-446655440012', name: 'MacBook Pro 14" - M3 Pro' },
    { id: '550e8400-e29b-41d4-a716-446655440003', variantId: '550e8400-e29b-41d4-a716-446655440013', name: 'AirPods Pro 2' },
];

export default function OrderFormPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdOrder, setCreatedOrder] = useState<OrderResponse | null>(null);

    const form = useForm<CreateOrderInput>({
        resolver: zodResolver(CreateOrderInputSchema),
        defaultValues: {
            items: [
                { productId: sampleProducts[0]!.id, variantId: sampleProducts[0]!.variantId, quantity: 1 },
            ],
            shippingAddress: {
                street: '',
                city: '',
                state: '',
                postalCode: '',
                country: 'US',
            },
            useSameAddress: true,
            notes: '',
        },
    });

    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'items',
    });

    async function onSubmit(data: CreateOrderInput) {
        setIsSubmitting(true);
        setCreatedOrder(null);

        try {
            // Call backend API
            const order = await ordersApi.create(data);
            setCreatedOrder(order);

            toast({
                title: '✅ Order placed successfully!',
                description: `Order ${order.orderNumber} created with ${order.items.length} item(s). Total: $${order.total.toFixed(2)}`,
            });

            form.reset();
        } catch (error) {
            if (error instanceof ApiError) {
                toast({
                    title: '❌ Error placing order',
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
            <div className="mx-auto max-w-2xl space-y-6">
                <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground">
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Back to Home
                </Link>

                <Card>
                    <CardHeader>
                        <CardTitle>Order Checkout Form</CardTitle>
                        <CardDescription>
                            Calls <code className="bg-muted px-1 rounded">POST /orders</code> with items and shipping address
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                                {/* Order Items */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Order Items</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isSubmitting}
                                            onClick={() => append({
                                                productId: sampleProducts[0]!.id,
                                                variantId: sampleProducts[0]!.variantId,
                                                quantity: 1,
                                            })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Item
                                        </Button>
                                    </div>

                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="p-4 bg-slate-50 dark:bg-slate-900">
                                            <div className="flex items-center gap-4">
                                                <div className="flex-1">
                                                    <p className="text-sm font-medium">
                                                        {sampleProducts.find(p => p.id === field.productId)?.name || 'Product'}
                                                    </p>
                                                    <p className="text-xs text-muted-foreground">
                                                        ID: {field.productId.slice(0, 8)}...
                                                    </p>
                                                </div>
                                                <FormField
                                                    control={form.control}
                                                    name={`items.${index}.quantity`}
                                                    render={({ field }) => (
                                                        <FormItem className="w-24">
                                                            <FormControl>
                                                                <Input
                                                                    type="number"
                                                                    min="1"
                                                                    disabled={isSubmitting}
                                                                    {...field}
                                                                    onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                                                                />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                {fields.length > 1 && (
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="icon"
                                                        disabled={isSubmitting}
                                                        onClick={() => remove(index)}
                                                        className="text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                )}
                                            </div>
                                        </Card>
                                    ))}
                                </div>

                                {/* Shipping Address */}
                                <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Shipping Address</h3>

                                    <FormField
                                        control={form.control}
                                        name="shippingAddress.street"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Street Address</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="123 Main St, Apt 4B" {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="shippingAddress.city"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>City</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="New York" {...field} disabled={isSubmitting} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shippingAddress.state"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>State</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="NY" {...field} disabled={isSubmitting} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>

                                    <div className="grid gap-4 md:grid-cols-2">
                                        <FormField
                                            control={form.control}
                                            name="shippingAddress.postalCode"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Postal Code</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="10001" {...field} disabled={isSubmitting} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                        <FormField
                                            control={form.control}
                                            name="shippingAddress.country"
                                            render={({ field }) => (
                                                <FormItem>
                                                    <FormLabel>Country (2-letter code)</FormLabel>
                                                    <FormControl>
                                                        <Input placeholder="US" maxLength={2} {...field} disabled={isSubmitting} />
                                                    </FormControl>
                                                    <FormMessage />
                                                </FormItem>
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Notes */}
                                <FormField
                                    control={form.control}
                                    name="notes"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Order Notes (Optional)</FormLabel>
                                            <FormControl>
                                                <Input placeholder="Any special instructions..." {...field} disabled={isSubmitting} />
                                            </FormControl>
                                            <FormDescription>Max 500 characters</FormDescription>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Placing Order...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Success Response Display */}
                {createdOrder && (
                    <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                        <CardHeader>
                            <CardTitle className="text-lg text-green-700 dark:text-green-300">
                                ✅ Order Placed: {createdOrder.orderNumber}
                            </CardTitle>
                            <CardDescription className="text-green-600 dark:text-green-400">
                                Total: ${createdOrder.total.toFixed(2)} | Status: {createdOrder.status}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs overflow-x-auto bg-white dark:bg-slate-950 p-4 rounded-md max-h-64">
                                {JSON.stringify(createdOrder, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
