
// Useエンティティ
// → usersテーブルの設計図 + リレーション(他のテーブルとの関係定義)を表している。

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
  @PrimaryGeneratedColumn('uuid') // 主キー、UUIDを自動生成
  id: string;

  @Column() // 通常のカラム
  name: string;

  @Column()
  @Index({ unique: true }) // 重複不可
  email: string;

  @Column()
  password: string;

  @Column({ nullable: true }) // nullを許可
  thumbnailUrl?: string;

  // BoardUserとの関係
  // ここでは、Userは複数のBoardUserを持つ。
  @OneToMany(() => BoardUser, (obj) => obj.user, { cascade: true })
  boardUsers?: BoardUser[];

  // Cardとの関係
  // ユーザーは複数のカードを持つ
  @OneToMany(() => Card, (obj) => obj.user, { cascade: true })
  cards?: Card[];

  @CreateDateColumn() // 日時カラム。自動で入る
  createdAt: Date;

  @UpdateDateColumn() // 日時カラムを自動更新
  updatedAt: Date;
}
