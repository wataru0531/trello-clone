
// authController

import { Router, Request, Response } from 'express';
import datasource from '../../datasource'; // DB接続＋ORM全体の管理者
import { User } from '../users/user.entity';
import { compare, hash } from 'bcryptjs';
import { encodeJwt } from '../../lib/jwt';
import { Board } from '../boards/board.entity';
import { BoardUser } from '../board-users/board-user.entity';

const authController = Router();

// Userエンティティ(＝usersテーブル)を操作するための「専用の窓口(Repository)」を取得
// Repository → そのテーブルを操作するための道具
// Entity(User) → テーブルの設計図
const userRepository = datasource.getRepository(User);

const boardRepository = datasource.getRepository(Board);
const boardUserRepository = datasource.getRepository(BoardUser);

// ✅ ユーザー登録
authController.post('/signup', async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      res.status(400).json({ message: '名前、メール、パスワードは必須です' });
      return;
    }

    // メールアドレスの重複チェック
    const existingUser = await userRepository.findOne({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: 'このメールアドレスは既に使用されています' });
      return;
    }

    // パスワードのハッシュ化
    const hashedPassword = await hash(password, 10);

    // ユーザー作成
    const user = await userRepository.save({
      name,
      email,
      password: hashedPassword,
    });

    const token = encodeJwt(user.id);

    // 新規ユーザー用のボードを作成
    const board = await boardRepository.save({
      name,
    });

    // ボードユーザーを作成
    await boardUserRepository.save({
      userId: user.id,
      boardId: board.id,
    });

    // ボード情報を含むユーザー情報を取得
    const userWithBoards = await userRepository.findOne({
      where: { id: user.id },
      relations: {
        boardUsers: true,
      },
    });

    if (!userWithBoards) {
      res.status(404).json({ message: 'ユーザーが見つかりません' });
      return;
    }

    // パスワードを除外してレスポンスを返す
    res.status(200).json({
      user: {
        ...userWithBoards,
        boardId: userWithBoards.boardUsers![0].boardId,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.error('ユーザー登録エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅ ログイン
authController.post('/signin', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // 必須項目のバリデーション
    if (!email || !password) {
      res.status(400).json({ message: 'メールとパスワードは必須です' });
      return;
    }

    // ユーザーの検索
    const user = await userRepository.findOne({
      where: { email },
      relations: {
        boardUsers: true,
      },
    });
    if (!user) {
      res
        .status(401)
        .json({ message: 'メールアドレスまたはパスワードが正しくありません' });
      return;
    }

    // パスワードの確認
    const isPasswordValid = await compare(password, user.password);
    if (!isPasswordValid) {
      res
        .status(401)
        .json({ message: 'メールアドレスまたはパスワードが正しくありません' });
      return;
    }

    // JWTトークンの生成
    const token = encodeJwt(user.id);

    // パスワードを除外してレスポンスを返す
    res.status(200).json({
      user: {
        ...user,
        boardId: user.boardUsers![0].boardId,
        password: undefined,
      },
      token,
    });
  } catch (error) {
    console.error('ログインエラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅ 現在のユーザー情報取得
authController.get('/me', async (req: Request, res: Response) => {
  try {
    if (req.currentUser == null) {
      res.status(200).json(null);
      return;
    }
    const user = await userRepository.findOne({
      where: { id: req.currentUser.id },
      relations: {
        boardUsers: true,
      },
    });
    if (!user) {
      res.status(404).json({ message: 'ユーザーが見つかりません' });
      return;
    }
    res.status(200).json({
      ...user,
      boardId: user.boardUsers![0].boardId,
      password: undefined,
    });
  } catch (error) {
    console.error('ユーザー情報取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default authController;
