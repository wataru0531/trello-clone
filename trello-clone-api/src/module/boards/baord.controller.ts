import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Board } from './board.entity';
import { Auth } from '../../lib/auth';
import { BoardUser } from '../board-users/board-user.entity';

const boardController = Router();
const boardRepository = datasource.getRepository(Board);
const boardUserRepository = datasource.getRepository(BoardUser);

// ユーザーが所属するボードを取得
boardController.get('/', Auth, async (req: Request, res: Response) => {
  try {
    const boards = await boardRepository.find({
      where: { boardUsers: { userId: req.currentUser.id } },
      relations: ['boardUsers', 'channels'],
    });

    res.status(200).json(boards);
  } catch (error) {
    console.error('ボード取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 特定のボードを取得
boardController.get('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const board = await boardRepository.findOne({
      where: { id },
    });

    if (!board) {
      res.status(404).json({ message: 'ボードが見つかりません' });
      return;
    }

    res.status(200).json(board);
  } catch (error) {
    console.error('ボード取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ボードを作成
boardController.post('/', Auth, async (req: Request, res: Response) => {
  try {
    const { name } = req.body;

    if (!name) {
      res.status(400).json({ message: 'ボード名は必須です' });
      return;
    }

    // ボードを作成
    const board = await boardRepository.save({
      name,
      adminUserId: req.currentUser.id,
      boardUsers: [],
      channels: [],
    });

    // 最初のリストを作成
    // 作成者をボードのメンバーとして追加
    await boardUserRepository.save({
      userId: req.currentUser.id,
      boardId: board.id,
    });

    res.status(201).json({ ...board });
  } catch (error) {
    console.error('ボード作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ボードを削除
boardController.delete('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingBoard = await boardRepository.findOne({
      // TODO ボードに招待されてる誰かだけが消せるように
      where: { id },
    });
    if (!existingBoard) {
      res.status(404).json({ message: 'ボードが見つかりません' });
      return;
    }

    await boardRepository.delete(id);

    res.status(200).json({ message: 'ボードを削除しました' });
  } catch (error) {
    console.error('ボード削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default boardController;
