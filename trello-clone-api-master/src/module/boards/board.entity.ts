import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { BoardUser } from '../board-users/board-user.entity';
import { List } from '../lists/list.entity';

@Entity()
export class Board {
  @PrimaryGeneratedColumn('uuid')
  id?: string;

  @Column()
  name: string;

  @OneToMany(() => BoardUser, (obj) => obj.board, { cascade: true })
  boardUsers?: BoardUser[];

  @OneToMany(() => List, (list) => list.board, { cascade: true })
  lists?: List[];

  @CreateDateColumn()
  readonly createdAt?: Date;

  @UpdateDateColumn()
  readonly updatedAt?: Date;
}
