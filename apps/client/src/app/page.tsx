import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function HomePage() {
    return (
        <div className="container py-10">
            <div className="mx-auto max-w-4xl space-y-8">
                {/* Header */}
                <div className="text-center space-y-4">
                    <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                        Monorepo Demo
                    </h1>
                    <p className="text-lg text-muted-foreground">
                        NestJS + Next.js with shared Zod validation schemas
                    </p>
                </div>

                {/* Feature Cards */}
                <div className="grid gap-6 md:grid-cols-2">
                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📝 User Registration
                            </CardTitle>
                            <CardDescription>
                                Simple form with email, name, and password validation
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/forms/user">
                                <Button className="w-full">Try User Form</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                📦 Product Creator
                            </CardTitle>
                            <CardDescription>
                                Complex nested form with variants and metadata
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/forms/product">
                                <Button className="w-full">Try Product Form</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🛒 Order Checkout
                            </CardTitle>
                            <CardDescription>
                                Multi-step form with address validation and items
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/forms/order">
                                <Button className="w-full">Try Order Form</Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="hover:shadow-lg transition-shadow border-dashed">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                🔗 Shared Types Demo
                            </CardTitle>
                            <CardDescription>
                                See how types flow from @repo/shared to forms
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            <Link href="/demo">
                                <Button variant="outline" className="w-full">View Demo</Button>
                            </Link>
                        </CardContent>
                    </Card>
                </div>

                {/* Info Section */}
                <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-0">
                    <CardContent className="pt-6">
                        <div className="space-y-4 text-sm">
                            <h3 className="font-semibold text-lg">How it works</h3>
                            <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                                <li>Schemas are defined once in <code className="bg-muted px-1 rounded">@repo/shared</code></li>
                                <li>Types are inferred from schemas using <code className="bg-muted px-1 rounded">z.infer&lt;&gt;</code></li>
                                <li>Frontend uses <code className="bg-muted px-1 rounded">react-hook-form</code> with <code className="bg-muted px-1 rounded">zodResolver</code></li>
                                <li>Backend uses <code className="bg-muted px-1 rounded">nestjs-zod</code> with <code className="bg-muted px-1 rounded">createZodDto</code></li>
                                <li>Swagger docs are auto-generated from the same schemas</li>
                            </ul>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
