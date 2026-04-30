import { OrderItem } from 'src/modules/order-item/entities/order-item.entity';
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class MenuItem {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ name: 'price', type: 'decimal' })
  price: number;

  @Column({ name: 'allergens', type: 'simple-array' })
  allergens: string[];

  @Column({ default: true })
  available: boolean;

  @OneToMany(() => OrderItem, (orderItem) => orderItem.menuItem)
  orderItems: OrderItem[];
}
