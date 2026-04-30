import { Student } from 'src/modules/student/entities/student.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Parent {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({
    default: 0,
    precision: 10,
    scale: 2,
    type: 'decimal',
    name: 'wallet_balance',
  })
  walletBalance: number;

  @OneToMany(() => Student, (student) => student.parent)
  students: Student[];
}
