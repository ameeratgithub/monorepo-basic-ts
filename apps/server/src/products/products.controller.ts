import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Delete,
    Query,
    HttpCode,
    HttpStatus,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { ProductResponse, PaginatedProductsResponse } from '@repo/shared';
import { ProductsService } from './products.service';
import {
    CreateProductDto,
    UpdateProductDto,
    ProductResponseDto,
    PaginatedProductsResponseDto,
} from './dto/product.dto';
import { PaginationQueryDto } from '../users/dto/user.dto';

@ApiTags('products')
@Controller('products')
export class ProductsController {
    constructor(private readonly productsService: ProductsService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new product with variants' })
    @ApiResponse({ status: 201, type: ProductResponseDto })
    async create(@Body() dto: CreateProductDto): Promise<ProductResponse> {
        return this.productsService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all products with pagination' })
    @ApiResponse({ status: 200, type: PaginatedProductsResponseDto })
    async findAll(@Query() query: PaginationQueryDto): Promise<PaginatedProductsResponse> {
        return this.productsService.findAll(query.page, query.pageSize);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a product by ID' })
    @ApiParam({ name: 'id', description: 'Product ID (UUID)' })
    @ApiResponse({ status: 200, type: ProductResponseDto })
    async findOne(@Param('id') id: string): Promise<ProductResponse> {
        return this.productsService.findOne(id);
    }

    @Patch(':id')
    @ApiOperation({ summary: 'Update a product' })
    @ApiParam({ name: 'id', description: 'Product ID (UUID)' })
    @ApiResponse({ status: 200, type: ProductResponseDto })
    async update(
        @Param('id') id: string,
        @Body() dto: UpdateProductDto,
    ): Promise<ProductResponse> {
        return this.productsService.update(id, dto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a product' })
    @ApiParam({ name: 'id', description: 'Product ID (UUID)' })
    async remove(@Param('id') id: string): Promise<void> {
        return this.productsService.remove(id);
    }
}
