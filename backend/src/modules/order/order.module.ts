import { Module } from '@nestjs/common';
import { OrderController } from './controllers/order.controller';
import { OrderService } from './services/order.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Order } from './entities/order.entity';
import { OrderRepository } from './repositories/order.repository';
import { MenuItemModule } from '../menu-item/menu-item.module';
import { ParentModule } from '../parent/parent.module';
import { StudentModule } from '../student/student.module';
import { OrderItemModule } from '../order-item/order-item.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Order]),
    MenuItemModule,
    ParentModule,
    StudentModule,
    OrderItemModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService],
})
export class OrderModule {}
