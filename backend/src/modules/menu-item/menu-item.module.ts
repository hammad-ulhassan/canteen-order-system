import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MenuItem } from './entities/menu-item.entity';
import { MenuItemService } from './services/menu-item.service';
import { MenuItemRepository } from './repositories/menu-item.respository';
import { MenuItemController } from './controllers/menu-item.controller';

@Module({
  controllers: [MenuItemController],
  imports: [TypeOrmModule.forFeature([MenuItem])],
  providers: [MenuItemService, MenuItemRepository],
  exports: [MenuItemService],
})
export class MenuItemModule {}
