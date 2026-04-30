import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, In, TypeORMError } from 'typeorm';
import { MenuItem } from '../entities/menu-item.entity';
import {
  CannotCreateResourceError,
  EntityNotFoundError,
} from 'src/common/errors/errors';

@Injectable()
export class MenuItemRepository {
  constructor(
    @InjectRepository(MenuItem)
    private repository: Repository<MenuItem>,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async createMenuIem(menuItem: MenuItem) {
    return this.repository.save(menuItem).catch(() => {
      throw new CannotCreateResourceError();
    });
  }

  async findByIds(menuItemIds: string[]) {
    return this.repository
      .find({
        where: {
          id: In(menuItemIds),
        },
      })
      .catch(() => {
        throw new EntityNotFoundError('menu-item', menuItemIds.join(','));
      });
  }

  async getAllMenuItems() {
    return this.repository.findAndCount().catch((err: TypeORMError) => {
      throw new Error(err.message);
    });
  }
}
