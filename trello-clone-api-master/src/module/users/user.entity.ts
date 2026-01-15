import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
  OneToMany,
} from 'typeorm';
import { BoardUser } from '../board-users/board-user.entity';
import { Card } from '../cards/card.entity';

@Entity()
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true })
  thumbnailUrl?: string;

  @OneToMany(() => BoardUser, (obj) => obj.user, { cascade: true })
  boardUsers?: BoardUser[];

  @OneToMany(() => Card, (obj) => obj.user, { cascade: true })
  cards?: Card[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
