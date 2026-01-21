import {
    Controller,
    Get,
    Post,
    Body,
    Patch,
    Param,
    Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import type { OrderResponse, PaginatedResponse } from '@repo/shared';
import { OrdersService } from './orders.service';
import { CreateOrderDto, UpdateOrderStatusDto, OrderResponseDto } from './dto/order.dto';
import { PaginationQueryDto } from '../users/dto/user.dto';

@ApiTags('orders')
@Controller('orders')
export class OrdersController {
    constructor(private readonly ordersService: OrdersService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new order' })
    @ApiResponse({ status: 201, type: OrderResponseDto })
    async create(@Body() dto: CreateOrderDto): Promise<OrderResponse> {
        return this.ordersService.create(dto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all orders with pagination' })
    async findAll(
        @Query() query: PaginationQueryDto,
    ): Promise<PaginatedResponse<OrderResponse>> {
        return this.ordersService.findAll(query.page, query.pageSize);
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get an order by ID' })
    @ApiParam({ name: 'id', description: 'Order ID (UUID)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async findOne(@Param('id') id: string): Promise<OrderResponse> {
        return this.ordersService.findOne(id);
    }

    @Patch(':id/status')
    @ApiOperation({ summary: 'Update order status' })
    @ApiParam({ name: 'id', description: 'Order ID (UUID)' })
    @ApiResponse({ status: 200, type: OrderResponseDto })
    async updateStatus(
        @Param('id') id: string,
        @Body() dto: UpdateOrderStatusDto,
    ): Promise<OrderResponse> {
        return this.ordersService.updateStatus(id, dto);
    }
}
