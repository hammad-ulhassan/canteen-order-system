import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { Order } from '../entities/order.entity';
import { EntityNotFoundError } from 'src/common/errors/errors';
import { MenuItem } from 'src/modules/menu-item/entities/menu-item.entity';
import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectRepository(Order)
    private repository: Repository<Order>,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async createAndSaveOrder(
    studentId: string,
    total: number,
    menuEntities: MenuItem[],
    itemsDto: { menuItemId: string; quantity: number }[],
  ): Promise<Order> {
    const orderItems = itemsDto.map((dto) => {
      const entity = menuEntities.find((e) => e.id === dto.menuItemId)!;

      const orderItem = new OrderItem();
      orderItem.menuItem = entity;
      orderItem.menuItemId = entity.id;
      orderItem.quantity = dto.quantity;
      return orderItem;
    });

    const order = this.repository.create({
      studentId,
      total,
      items: orderItems,
    });

    return await this.repository.save(order);
  }

  async findByStudentId(studentId: string): Promise<Order[]> {
    return await this.repository
      .find({
        where: { studentId },
        relations: ['items'],
      })
      .catch(() =>
        //error
        {
          //can push error object into error constructor for detailed logs
          throw new EntityNotFoundError('order.studentId', studentId);
        },
      );
  }
}
