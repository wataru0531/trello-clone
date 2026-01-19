
// ✅ 

import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { User } from './user.entity';
import { Auth } from '../../lib/auth';
import { Like, Not } from 'typeorm';

const userController = Router();
const userRepository = datasource.getRepository(User);

userController.get('/', Auth, async (req: Request, res: Response) => {
  try {
    const { keyword } = req.query;

    if (!keyword || typeof keyword !== 'string') {
      res.status(400).json({ message: '検索キーワードを指定してください' });
      return;
    }

    const users = await userRepository.find({
      where: [
        {
          name: Like(`%${keyword}%`),
          id: Not(req.currentUser.id),
        },
        {
          email: Like(`%${keyword}%`),
          id: Not(req.currentUser.id),
        },
      ],
      select: ['id', 'name', 'email', 'thumbnailUrl'],
      relations: ['workspaceUsers'],
    });

    res.status(200).json(users);
  } catch (error) {
    console.error('ユーザー検索エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default userController;
