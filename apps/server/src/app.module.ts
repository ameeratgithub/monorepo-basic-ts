import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_PIPE } from '@nestjs/core';
import { ZodValidationPipe } from 'nestjs-zod';
import { UsersModule } from './users/users.module';
import { ProductsModule } from './products/products.module';
import { OrdersModule } from './orders/orders.module';

@Module({
    imports: [
        // TypeORM configuration
        TypeOrmModule.forRoot({
            type: 'postgres',
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT || '5432'),
            username: process.env.DB_USERNAME || 'devuser',
            password: process.env.DB_PASSWORD || 'devuserpassword',
            database: process.env.DB_NAME || 'monorepo_db',
            autoLoadEntities: true,
            synchronize: process.env.NODE_ENV !== 'production', // Disable in production
            logging: process.env.NODE_ENV !== 'production',
        }),
        UsersModule,
        ProductsModule,
        OrdersModule,
    ],
    providers: [
        // Global Zod validation (alternative to app.useGlobalPipes)
        {
            provide: APP_PIPE,
            useClass: ZodValidationPipe,
        },
    ],
})
export class AppModule { }
