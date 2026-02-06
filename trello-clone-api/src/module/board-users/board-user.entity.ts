import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
  ManyToOne,
} from 'typeorm';
import { User } from '../users/user.entity';
import { Board } from '../boards/board.entity';

@Entity()
export class BoardUser {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.BoardUsers)
  @Index()
  user: User;

  @Column()
  boardId: string;

  @ManyToOne(() => Board, (Board) => Board.boardUsers)
  @Index()
  board: Board;

  @CreateDateColumn()
  createdAt: Date;
}
