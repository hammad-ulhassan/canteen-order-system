import { Module } from '@nestjs/common';
import { ParentModule } from '../parent/parent.module';
import { StudentModule } from '../student/student.module';
import { SeedService } from './services/seed.service';
import { MenuItemModule } from '../menu-item/menu-item.module';

@Module({
  providers: [SeedService],
  exports: [SeedService],
  imports: [ParentModule, StudentModule, MenuItemModule],
})
export class SeedModule {}
