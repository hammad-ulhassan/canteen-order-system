import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { MenuItemService } from 'src/modules/menu-item/services/menu-item.service';
import { ParentService } from 'src/modules/parent/services/parent.service';
import { StudentService } from 'src/modules/student/services/student.service';

@Injectable()
export class SeedService implements OnApplicationBootstrap {
  private readonly logger = new Logger(SeedService.name);
  constructor(
    private readonly parentService: ParentService,
    private readonly studentService: StudentService,
    private readonly menuItemService: MenuItemService,
  ) {}

  async onApplicationBootstrap() {
    // throw new Error('Method not implemented.');
    const parentCount = await this.parentService.getParentCount();

    // to avoid re-adding seed data if already added
    if (parentCount > 0) {
      this.logger.log('Database already contains data. Skipping seed.');
      return;
    }

    this.logger.log('Database is empty. Starting seed...');
    await this.runSeed();
  }

  private async runSeed() {
    try {
      const parent = await this.parentService.createParent('John Doe', 250.75); //should send parent obj as param but lets go for now

      const students = [
        { name: 'Student A', allergens: ['Nuts'], parentId: parent.id },
        { name: 'Student B', allergens: [], parentId: parent.id },
      ];

      for (const { name, allergens, parentId } of students) {
        await this.studentService.addStudent(name, allergens, parentId);
      }

      const menuItems = [
        {
          name: 'MenuItem 1',
          allergens: ['Nuts'],
          available: true,
          price: 2.1,
        },
        { name: 'MenuItem 2', allergens: [], available: true, price: 5.56 },
        { name: 'MenuItem 3', allergens: [], available: true, price: 7.08 },
      ];

      for (const { name, allergens, available, price } of menuItems) {
        await this.menuItemService.createMenuItem(
          name,
          price,
          allergens,
          available,
        );
      }

      this.logger.log('Seed data inserted successfully.');
    } catch (error) {
      this.logger.error('Seed process failed', error);
    }
  }
}
