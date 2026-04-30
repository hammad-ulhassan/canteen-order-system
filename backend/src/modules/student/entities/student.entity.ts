import { Order } from 'src/modules/order/entities/order.entity';
import { Parent } from 'src/modules/parent/entites/parent.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Student {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'allergens', type: 'simple-array' })
  allergens: string[];

  @ManyToOne(() => Parent, (parent) => parent.students, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  parent: Parent;

  @Column()
  parentId: string;

  @OneToMany(() => Order, (order) => order.student)
  orders: Order[];
}
