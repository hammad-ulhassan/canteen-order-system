import { Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, TypeORMError } from 'typeorm';
import { Parent } from '../entites/parent.entity';
import {
  CannotCreateResourceError,
  EntityNotFoundError,
} from 'src/common/errors/errors';

@Injectable()
export class ParentRepository {
  constructor(
    @InjectRepository(Parent)
    private repository: Repository<Parent>,
    @Inject(DataSource)
    private readonly dataSource: DataSource,
  ) {}

  async countParents() {
    return this.repository.count().catch((err: TypeORMError) => {
      throw new Error(err.message);
    });
  }

  async findOneByParentId(parentId: string) {
    return this.repository
      .findOne({
        where: {
          id: parentId,
        },
      })
      .catch(() => {
        throw new EntityNotFoundError('parent', parentId);
      });
  }

  async createParent(parent: Parent) {
    return this.repository.save(parent).catch(() => {
      throw new CannotCreateResourceError();
    });
  }

  async getAllParents() {
    return this.repository.findAndCount().catch((err: TypeORMError) => {
      throw new Error(err.message);
    });
  }

  async updateBalance(parentId: string, newBalance: number) {
    return this.repository
      .update(parentId, { walletBalance: newBalance })
      .catch(() => {
        throw new CannotCreateResourceError();
      });
  }
}
