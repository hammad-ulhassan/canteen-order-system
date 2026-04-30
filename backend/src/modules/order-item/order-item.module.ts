import { Module } from '@nestjs/common';
import { OrderItem } from './entities/order-item.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OrderItemRepository } from './repositories/order-item.repository';
import { OrderItemService } from './services/order-item.service';

@Module({
  imports: [TypeOrmModule.forFeature([OrderItem])],
  exports: [OrderItemService],
  providers: [OrderItemRepository, OrderItemService],
})
export class OrderItemModule {}
