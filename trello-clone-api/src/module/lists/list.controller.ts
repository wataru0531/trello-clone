
// ✅ list.controller.ts

import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { List } from './list.entity';
import { Auth } from '../../lib/auth';
import { In } from 'typeorm';

const listController = Router();
const listRepository = datasource.getRepository(List);


// ✅ ボード内のリストを取得
// Authが実行 → 問題なければ、Auth内のnext()は走り次のコールバックが実行される。
//           → currentUserが存在するかどうかをチェック
listController.get('/:boardId', Auth, async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const lists = await listRepository.find({
      where: { boardId },
      relations: ['cards'],
      order: { position: 'ASC' }, // 昇順　1 2 3
    });

    res.status(200).json(lists);
  } catch (error) {
    console.error('リスト取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅ 特定のリストを取得
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

// ✅ リストを作成
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
    const { lists } = req.body; // 更新したいリスト
    // console.log(lists); // 👉 更新後の配列

    const listsToUpdate = Array.isArray(lists) ? lists : [lists]; // リクエストが配列でない場合は配列に変換

    if (listsToUpdate == null || listsToUpdate.length === 0) {
      res.status(400).json({ message: '更新するリストが指定されていません' });
      return;
    }

    // ✅ 更新対象のリストIDを取得
    // ✅ 更新対象として“安全に”扱えるリストIDだけを抽出する ... null、undefinedなどがある可能性があるため。DBを壊さない
    // console.log(listsToUpdate.map(list => list.id)); // [ 'cd3178fb-1e2f-4f42-b428-7c2dbed63d6b', 'b53c7c1d-b7db-4cd1-ba68-ed030a8b8f5c', '21c84dc2-75e3-4ef4-9be8-e2ab753d4c24', '5cabb825-f10e-4e83-8cdc-cb807295f9b9']
    // console.log(listsToUpdate.map((list) => list.id).filter((id) => id))
    const listIds = listsToUpdate.map((list) => list.id).filter((id) => id);
    // console.log(listIds); // [ 'cd3178fb-1e2f-4f42-b428-7c2dbed63d6b', 'b53c7c1d-b7db-4cd1-ba68-ed030a8b8f5c', '21c84dc2-75e3-4ef4-9be8-e2ab753d4c24', '5cabb825-f10e-4e83-8cdc-cb807295f9b9']

    if (listIds.length === 0) {
      res.status(400).json({ message: 'リストIDが指定されていません' });
      return;
    }

    // 既存のListエンティティを取得
    // 👉 指定されたIDのリストを、DBからまとめて取得
    const existingLists = await listRepository.findBy({
      id: In(listIds),
    });

    // ⭐️ 既存データに更新データをマージ
    // existingLists → DBから取得した既存データ
    // listsToUpdate → フロントから送られてきた更新データ
    const mergedLists = existingLists.map((existingList) => {
      const updateData = listsToUpdate.find(
        (list) => list.id === existingList.id
      );
      // console.log(updateData); // 更新後のリストの配列
      // 例えば...
      // フロント　[2, 1, 4, 3] 
      // DB [1, 2 , 3, 4] 
      // だとしたら、 これらを全て結びつけてすべてのリストを更新

      return {
        ...existingList,
        ...updateData,
      };
    });

    // ✅ 一括更新
    // IDが既に存在する行は、title と position だけを更新する」
    // IDが存在しない行は INSERT される
    await datasource
      .createQueryBuilder()
      .insert()
      .into(List)
      .values(mergedLists)
      .orUpdate(['title', 'position'])
      .execute();

    const updatedLists = await listRepository.findBy({ // 👉 DBの最新の状態を取得
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
