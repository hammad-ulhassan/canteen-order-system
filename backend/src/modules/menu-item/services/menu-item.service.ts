import { Injectable } from '@nestjs/common';
import { MenuItemRepository } from '../repositories/menu-item.respository';
import { MenuItem } from '../entities/menu-item.entity';

@Injectable()
export class MenuItemService {
  constructor(private readonly menuItemRepository: MenuItemRepository) {}

  async createMenuItem(
    name: string,
    price: number,
    allergens: string[],
    available: boolean,
  ) {
    const menuItem = new MenuItem(); // theres a better way to do this. object wise using .create() then .upsert or .save or whatever
    menuItem.name = name;
    menuItem.price = price;
    menuItem.available = available;
    menuItem.allergens = allergens;

    return await this.menuItemRepository.createMenuIem(menuItem);
  }

  async findByIds(menuItemIds: string[]) {
    return await this.menuItemRepository.findByIds(menuItemIds);
  }

  async getAllMenuItems() {
    return await this.menuItemRepository.getAllMenuItems();
  }
}
