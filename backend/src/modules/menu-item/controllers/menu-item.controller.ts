import { Controller, Get, HttpStatus } from '@nestjs/common';
import { MenuItemService } from '../services/menu-item.service';
import { handleResponse } from 'src/common/utils';

@Controller('menu-item')
export class MenuItemController {
  constructor(private readonly menuItemService: MenuItemService) {}

  @Get('all')
  async getAllMenuItems() {
    try {
      const data = await this.menuItemService.getAllMenuItems();
      return handleResponse(data);
    } catch (error) {
      return handleResponse(error, HttpStatus.BAD_REQUEST);
    }
  }
}
