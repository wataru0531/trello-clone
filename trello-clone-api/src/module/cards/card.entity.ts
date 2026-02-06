import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
} from 'typeorm';
import { List } from '../lists/list.entity';
import { User } from '../users/user.entity';

@Entity()
export class Card {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  title: string;

  @Column({ type: 'text', nullable: true })
  description?: string;

  @Column()
  position: number;

  @Column({ default: false })
  completed: boolean = false;

  @Column({ nullable: true })
  dueDate?: Date;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.cards)
  user: User;

  @Column()
  listId: string;

  @ManyToOne(() => List, (list) => list.cards, { onDelete: 'CASCADE' })
  list: List;

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
