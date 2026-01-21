'use client';

import { useState } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Loader2 } from 'lucide-react';

// Import shared schema and type from @repo/shared
import { CreateProductInputSchema, type CreateProductInput, type ProductCategory, type ProductResponse } from '@repo/shared';

// Import API client
import { productsApi, ApiError } from '@/lib/api';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

const categories: ProductCategory[] = [
    'electronics',
    'clothing',
    'books',
    'home',
    'sports',
    'other',
];

export default function ProductFormPage() {
    const { toast } = useToast();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [createdProduct, setCreatedProduct] = useState<ProductResponse | null>(null);

    // Complex form with nested arrays using shared schema
    const form = useForm<CreateProductInput>({
        resolver: zodResolver(CreateProductInputSchema),
        defaultValues: {
            name: '',
            description: '',
            category: 'electronics',
            basePrice: 0,
            variants: [
                { sku: '', name: 'Default', price: 0, stock: 0 },
            ],
            tags: [],
            isActive: true,
        },
    });

    // Field array for dynamic variants
    const { fields, append, remove } = useFieldArray({
        control: form.control,
        name: 'variants',
    });

    async function onSubmit(data: CreateProductInput) {
        setIsSubmitting(true);
        setCreatedProduct(null);

        try {
            // Call backend API
            const product = await productsApi.create(data);
            setCreatedProduct(product);

            toast({
                title: '✅ Product created successfully!',
                description: `Created: ${product.name} with ${product.variants.length} variant(s)`,
            });

            form.reset();
        } catch (error) {
            if (error instanceof ApiError) {
                toast({
                    title: '❌ Error creating product',
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
                        <CardTitle>Product Creator Form</CardTitle>
                        <CardDescription>
                            Calls <code className="bg-muted px-1 rounded">POST /products</code> with nested variants
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                                {/* Basic Info */}
                                <div className="grid gap-4 md:grid-cols-2">
                                    <FormField
                                        control={form.control}
                                        name="name"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Product Name</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="iPhone 15 Pro" {...field} disabled={isSubmitting} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />

                                    <FormField
                                        control={form.control}
                                        name="category"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Category</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isSubmitting}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select category" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {categories.map((cat) => (
                                                            <SelectItem key={cat} value={cat}>
                                                                {cat.charAt(0).toUpperCase() + cat.slice(1)}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                </div>

                                <FormField
                                    control={form.control}
                                    name="basePrice"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Base Price ($)</FormLabel>
                                            <FormControl>
                                                <Input
                                                    type="number"
                                                    step="0.01"
                                                    placeholder="999.99"
                                                    {...field}
                                                    disabled={isSubmitting}
                                                    onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                {/* Variants Section */}
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-lg font-semibold">Variants</h3>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            size="sm"
                                            disabled={isSubmitting}
                                            onClick={() => append({ sku: '', name: '', price: 0, stock: 0 })}
                                        >
                                            <Plus className="mr-2 h-4 w-4" />
                                            Add Variant
                                        </Button>
                                    </div>

                                    {fields.map((field, index) => (
                                        <Card key={field.id} className="p-4">
                                            <div className="flex items-start gap-4">
                                                <div className="flex-1 grid gap-4 md:grid-cols-4">
                                                    <FormField
                                                        control={form.control}
                                                        name={`variants.${index}.sku`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">SKU</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="SKU-001" {...field} disabled={isSubmitting} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`variants.${index}.name`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">Name</FormLabel>
                                                                <FormControl>
                                                                    <Input placeholder="256GB Black" {...field} disabled={isSubmitting} />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`variants.${index}.price`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">Price</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        step="0.01"
                                                                        disabled={isSubmitting}
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                    <FormField
                                                        control={form.control}
                                                        name={`variants.${index}.stock`}
                                                        render={({ field }) => (
                                                            <FormItem>
                                                                <FormLabel className="text-xs">Stock</FormLabel>
                                                                <FormControl>
                                                                    <Input
                                                                        type="number"
                                                                        disabled={isSubmitting}
                                                                        {...field}
                                                                        onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                                                                    />
                                                                </FormControl>
                                                                <FormMessage />
                                                            </FormItem>
                                                        )}
                                                    />
                                                </div>
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
                                    {form.formState.errors.variants?.message && (
                                        <p className="text-sm font-medium text-destructive">
                                            {form.formState.errors.variants.message}
                                        </p>
                                    )}
                                </div>

                                <Button type="submit" className="w-full" disabled={isSubmitting}>
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Creating...
                                        </>
                                    ) : (
                                        'Create Product'
                                    )}
                                </Button>
                            </form>
                        </Form>
                    </CardContent>
                </Card>

                {/* Success Response Display */}
                {createdProduct && (
                    <Card className="border-green-500 bg-green-50 dark:bg-green-950">
                        <CardHeader>
                            <CardTitle className="text-lg text-green-700 dark:text-green-300">
                                ✅ Product Created
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <pre className="text-xs overflow-x-auto bg-white dark:bg-slate-950 p-4 rounded-md max-h-64">
                                {JSON.stringify(createdProduct, null, 2)}
                            </pre>
                        </CardContent>
                    </Card>
                )}
            </div>
        </div>
    );
}
