import { Injectable } from '@nestjs/common';
import { ParentRepository } from '../repositories/parent.repository';
import { Parent } from '../entites/parent.entity';

@Injectable()
export class ParentService {
  constructor(private readonly parentRepository: ParentRepository) {}

  async createParent(name: string, walletBalance: number): Promise<Parent> {
    const parent = new Parent();
    parent.name = name;
    parent.walletBalance = walletBalance;

    return await this.parentRepository.createParent(parent);
  }

  async getParentCount(): Promise<number> {
    return await this.parentRepository.countParents();
  }

  async getAllParents() {
    return await this.parentRepository.getAllParents();
  }

  async findOneByParentId(parentId: string) {
    return await this.parentRepository.findOneByParentId(parentId);
  }

  async updateParentBalance(parentId: string, newBalance: number) {
    return await this.parentRepository.updateBalance(parentId, newBalance);
  }
}
