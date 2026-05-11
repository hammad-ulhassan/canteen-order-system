import { Injectable } from '@nestjs/common';
import { OrderRepository } from '../repositories/order.repository';
import { ParentService } from 'src/modules/parent/services/parent.service';
import { StudentService } from 'src/modules/student/services/student.service';
import { MenuItemService } from 'src/modules/menu-item/services/menu-item.service';
import { Transactional } from 'typeorm-transactional';
import {
  AllergenConflictError,
  CannotCreateResourceError,
  InsufficientBalanceError,
  ItemUnavailableError,
} from 'src/common/errors/errors';
import { Parent } from 'src/modules/parent/entites/parent.entity';
import { CreateOrderDto } from '../dtos/order.dto';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepo: OrderRepository,
    private readonly parentService: ParentService,
    private readonly studentService: StudentService,
    private readonly menuItemService: MenuItemService,
  ) {}

  @Transactional()
  async createOrder(createOrderDto: CreateOrderDto) {
    const { studentId, items: itemsDto } = createOrderDto;
    let parent: Parent | null = null;

    const student = await this.studentService.findOneByStudentId(studentId);
    if (student) {
      parent = await this.parentService.findOneByParentId(student.parentId);
    }

    const menuItemIds = itemsDto.map((i) => i.menuItemId);
    const menuEntities = await this.menuItemService.findByIds(menuItemIds);

    if (student) {
      for (const entity of menuEntities) {
        if (!entity.available) throw new ItemUnavailableError(entity.name);

        const conflict = entity.allergens.find((a) =>
          student.allergens.includes(a),
        );
        if (conflict) throw new AllergenConflictError(conflict);
      }
    }

    const total = itemsDto.reduce((sum, itemDto) => {
      const entity = menuEntities.find((e) => e.id === itemDto.menuItemId);
      return sum + Number(entity?.price || 0) * itemDto.quantity;
    }, 0);

    if (parent) {
      if (parent.walletBalance < total) throw new InsufficientBalanceError();
      await this.parentService.updateParentBalance(
        parent.id,
        parent.walletBalance - total,
      );
    }

    if (student) {
      return await this.orderRepo.createAndSaveOrder(
        student.id,
        total,
        menuEntities,
        itemsDto,
      );
    }
    throw new CannotCreateResourceError('Order');
  }

  async getAllOrders() {
    return await this.orderRepo.getAllOrders();
  }
}
