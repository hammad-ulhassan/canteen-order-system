import { Module } from '@nestjs/common';
import { ParentController } from './controllers/parent.controller';
import { ParentService } from './services/parent.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Parent } from './entites/parent.entity';
import { ParentRepository } from './repositories/parent.repository';

@Module({
  imports: [TypeOrmModule.forFeature([Parent])],
  controllers: [ParentController],
  providers: [ParentRepository, ParentService],
  exports: [ParentService],
})
export class ParentModule {}
