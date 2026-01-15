import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { List } from './list.entity';
import { Auth } from '../../lib/auth';
import { In } from 'typeorm';

const listController = Router();
const listRepository = datasource.getRepository(List);

// ボード内のリストを取得
listController.get('/:boardId', Auth, async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const lists = await listRepository.find({
      where: { boardId },
      relations: ['cards'],
      order: { position: 'ASC' },
    });

    res.status(200).json(lists);
  } catch (error) {
    console.error('リスト取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 特定のリストを取得
listController.get('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const list = await listRepository.findOne({
      where: { id },
      relations: ['cards'],
    });

    if (!list) {
      res.status(404).json({ message: 'リストが見つかりません' });
      return;
    }

    res.status(200).json(list);
  } catch (error) {
    console.error('リスト取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// リストを作成
listController.post('/', Auth, async (req: Request, res: Response) => {
  try {
    const { title, boardId } = req.body;

    if (!title) {
      res.status(400).json({ message: 'リストタイトルは必須です' });
      return;
    }

    if (!boardId) {
      res.status(400).json({ message: 'ボードIDは必須です' });
      return;
    }

    // 最大position値を取得
    const maxPositionResult = await listRepository
      .createQueryBuilder('list')
      .select('MAX(list.position)', 'maxPosition')
      .where('list.boardId = :boardId', { boardId })
      .getRawOne();

    const nextPosition =
      maxPositionResult.maxPosition != null
        ? maxPositionResult.maxPosition + 1
        : 0;

    const list = await listRepository.save({
      title,
      boardId,
      position: nextPosition,
    });

    res.status(201).json(list);
  } catch (error) {
    console.error('リスト作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// リストを更新（単一または複数）
listController.put('/', Auth, async (req: Request, res: Response) => {
  try {
    const { lists } = req.body;

    // リクエストが配列でない場合は配列に変換
    const listsToUpdate = Array.isArray(lists) ? lists : [lists];

    if (listsToUpdate == null || listsToUpdate.length === 0) {
      res.status(400).json({ message: '更新するリストが指定されていません' });
      return;
    }

    // 更新対象のリストIDを取得
    const listIds = listsToUpdate.map((list) => list.id).filter((id) => id);

    if (listIds.length === 0) {
      res.status(400).json({ message: 'リストIDが指定されていません' });
      return;
    }

    // 既存のListエンティティを取得
    const existingLists = await listRepository.findBy({
      id: In(listIds),
    });

    // 既存データに更新データをマージ
    const mergedLists = existingLists.map((existingList) => {
      const updateData = listsToUpdate.find(
        (list) => list.id === existingList.id
      );
      return {
        ...existingList,
        ...updateData,
      };
    });

    // 一括更新
    await datasource
      .createQueryBuilder()
      .insert()
      .into(List)
      .values(mergedLists)
      .orUpdate(['title', 'position'])
      .execute();

    const updatedLists = await listRepository.findBy({
      id: In(listIds),
    });

    res.status(200).json(updatedLists);
  } catch (error) {
    console.error('リスト更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// 単一リストの更新（後方互換性のため残す）
listController.put('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { title } = req.body;

    const existingList = await listRepository.findOne({
      where: { id },
    });

    if (!existingList) {
      res.status(404).json({ message: 'リストが見つかりません' });
      return;
    }

    if (!title) {
      res.status(400).json({ message: 'リストタイトルは必須です' });
      return;
    }

    await listRepository.update(id, { title });
    const updatedList = await listRepository.findOne({
      where: { id },
      relations: ['cards'],
    });

    res.status(200).json(updatedList);
  } catch (error) {
    console.error('リスト更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// リストの位置を更新
listController.put(
  '/:id/position',
  Auth,
  async (req: Request, res: Response) => {
    try {
      const { id } = req.params;
      const { position } = req.body;

      const existingList = await listRepository.findOne({
        where: { id },
      });

      if (!existingList) {
        res.status(404).json({ message: 'リストが見つかりません' });
        return;
      }

      if (position === undefined || position === null) {
        res.status(400).json({ message: 'positionは必須です' });
        return;
      }

      await listRepository.update(id, { position });
      const updatedList = await listRepository.findOne({
        where: { id },
        relations: ['cards'],
      });

      res.status(200).json(updatedList);
    } catch (error) {
      console.error('リスト位置更新エラー:', error);
      res.status(500).json({ message: 'サーバーエラーが発生しました' });
    }
  }
);

// リストを削除
listController.delete('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingList = await listRepository.findOne({
      where: { id },
    });

    if (!existingList) {
      res.status(404).json({ message: 'リストが見つかりません' });
      return;
    }

    await listRepository.delete(id);

    res.status(200).json({ message: 'リストを削除しました' });
  } catch (error) {
    console.error('リスト削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default listController;
