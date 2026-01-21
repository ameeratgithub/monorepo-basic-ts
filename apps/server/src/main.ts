import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { patchNestJsSwagger, ZodValidationPipe } from 'nestjs-zod';
import { AppModule } from './app.module';

async function bootstrap() {
    // Patch Swagger to work with Zod DTOs
    patchNestJsSwagger();

    const app = await NestFactory.create(AppModule);

    // Enable CORS for frontend
    app.enableCors({
        origin: ['http://localhost:3000'],
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        credentials: true,
    });

    // Global Zod validation pipe
    app.useGlobalPipes(new ZodValidationPipe());

    // Swagger/OpenAPI setup
    const config = new DocumentBuilder()
        .setTitle('Monorepo API')
        .setDescription('NestJS API with Zod validation and shared types')
        .setVersion('1.0')
        .addBearerAuth()
        .addTag('users', 'User management endpoints')
        .addTag('products', 'Product management endpoints')
        .addTag('orders', 'Order management endpoints')
        .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api', app, document, {
        jsonDocumentUrl: 'api/json',
        swaggerOptions: {
            persistAuthorization: true,
        },
    });

    const port = process.env.PORT || 3001;
    await app.listen(port);
    console.log(`🚀 Server running on http://localhost:${port}`);
    console.log(`📚 Swagger docs at http://localhost:${port}/api`);
}

bootstrap();
