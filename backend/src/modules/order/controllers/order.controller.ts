import { Body, Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { CreateOrderDto } from '../dtos/order.dto';
import { handleResponse } from 'src/common/utils';

@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post()
  async create(@Body() createOrderDto: CreateOrderDto) {
    try {
      const order = await this.orderService.createOrder(createOrderDto);
      return handleResponse(order, HttpStatus.OK);
    } catch (error) {
      return handleResponse(error, HttpStatus.BAD_REQUEST);
    }
  }

  @Get('all')
  async getAllOrders() {
    try {
      const data = await this.orderService.getAllOrders();
      return handleResponse(data);
    } catch (error) {
      return handleResponse(error, HttpStatus.BAD_REQUEST);
    }
  }
}
