import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { BoardUser } from './board-user.entity';
import { Auth } from '../../lib/auth';
import { Board } from '../boards/board.entity';
import { User } from '../users/user.entity';

const boardUserController = Router();
const boardUserRepository = datasource.getRepository(BoardUser);
const baordRepository = datasource.getRepository(Board);
const userRepository = datasource.getRepository(User);

// 複数のユーザーをワークスペースに追加
boardUserController.post(
  '/:baordId',
  Auth,
  async (req: Request, res: Response) => {
    try {
      const { baordId } = req.params;
      const { userIds } = req.body;

      if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
        res.status(400).json({ message: 'ユーザーIDの配列が必要です' });
        return;
      }

      // ワークスペースの存在確認
      const baord = await baordRepository.findOne({
        where: { id: baordId },
      });

      if (!baord) {
        res.status(404).json({ message: 'ワークスペースが見つかりません' });
        return;
      }

      // ユーザーが存在するか確認
      const users = await userRepository.find({
        where: userIds.map((id) => ({ id })),
      });

      if (users.length !== userIds.length) {
        res.status(400).json({ message: '一部のユーザーが存在しません' });
        return;
      }

      // 既存のボードユーザーを取得
      const existingBoardUsers = await boardUserRepository.find({
        where: userIds.map((userId) => ({
          userId,
          baordId,
        })),
      });

      const existingUserIds = existingBoardUsers.map((bu) => bu.userId);

      // まだ追加されていないユーザーIDをフィルタリング
      const newUserIds = userIds.filter((id) => !existingUserIds.includes(id));

      if (newUserIds.length === 0) {
        res.status(400).json({
          message:
            '指定されたすべてのユーザーは既にワークスペースに追加されています',
        });
        return;
      }

      // 新しいボードユーザーを作成
      const boardUsers = newUserIds.map((userId) => ({
        userId,
        baordId,
      }));

      const createdBoardUsers = await boardUserRepository.save(boardUsers);

      res.status(201).json({
        message: `${createdBoardUsers.length}人のユーザーをワークスペースに追加しました`,
        boardUsers: createdBoardUsers,
      });
    } catch (error) {
      console.error('ボードユーザー作成エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

export default boardUserController;
