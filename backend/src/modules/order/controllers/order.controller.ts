import { Body, Controller, HttpStatus, Post } from '@nestjs/common';
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
}
