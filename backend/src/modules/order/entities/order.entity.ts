import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { Student } from 'src/modules/student/entities/student.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  Column,
  OneToMany,
  JoinColumn,
} from 'typeorm';

@Entity()
export class Order {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => Student, (student) => student.orders, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  student: Student;

  @Column()
  studentId: string;

  @OneToMany(() => OrderItem, (item) => item.order, {
    cascade: true,
  })
  items: OrderItem[];

  @Column('decimal')
  total: number;
}
