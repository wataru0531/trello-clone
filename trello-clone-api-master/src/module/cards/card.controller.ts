
// ✅ card.controller

import { Router, Request, Response } from 'express';
import datasource from '../../datasource';
import { Card } from './card.entity';
import { Auth } from '../../lib/auth';
import { In } from 'typeorm';

const cardController = Router();
const cardRepository = datasource.getRepository(Card);

// ✅ ボード内のカードを取得
cardController.get('/:boardId', Auth, async (req: Request, res: Response) => {
  try {
    const { boardId } = req.params;
    const cards = await cardRepository
      .createQueryBuilder('card')
      .innerJoin('list', 'list', 'card.listId = list.id')
      .where('list.boardId = :boardId', { boardId })
      .orderBy('card.position', 'ASC')
      .getMany();

    res.status(200).json(cards);
  } catch (error) {
    console.error('カード取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅ 特定のカードを取得
cardController.get('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const card = await cardRepository.findOne({
      where: { id },
    });

    if (!card) {
      res.status(404).json({ message: 'カードが見つかりません' });
      return;
    }

    res.status(200).json(card);
  } catch (error) {
    console.error('カード取得エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅　カードを作成
cardController.post('/', Auth, async (req: Request, res: Response) => {
  try {
    const { listId, title } = req.body; // リストid → リストに紐づくカード

    if (!title) {
      res.status(400).json({ message: 'カードタイトルは必須です' });
      return;
    }

    if (!listId) {
      res.status(400).json({ message: 'リストIDは必須です' });
      return;
    }

    // ✅　リストの中で、カードを一番下(末尾)に追加するための並び順(position)を決めていく

    // 既存のカードの中での一番大きいposition値を取得
    const maxPositionResult = await cardRepository
      .createQueryBuilder('card')
      .select('MAX(card.position)', 'maxPosition')
      .where('card.listId = :listId', { listId }) // 👉 指定されたlistIdに属するカードだけを対象に
      .getRawOne(); // 

    // すでにカードがあるなら → +1 のposition
    // まだ1枚もないなら → 0 からスタート
    const nextPosition = maxPositionResult.maxPosition != null
                      ? maxPositionResult.maxPosition + 1
                      : 0;

    const card = await cardRepository.save({ // そのpositionで保存
      userId: req.currentUser.id,
      title,
      listId,
      position: nextPosition,
    });

    res.status(201).json(card);
  } catch (error) {
    console.error('カード作成エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅　カードを更新（単一または複数）
cardController.put('/', Auth, async (req: Request, res: Response) => {
  try {
    const { cards } = req.body;

    // リクエストが配列でない場合は配列に変換
    const cardsToUpdate = Array.isArray(cards) ? cards : [cards];

    if (cardsToUpdate == null || cardsToUpdate.length === 0) {
      res.status(400).json({ message: '更新するカードが指定されていません' });
      return;
    }

    // 更新対象のカードIDだけの配列を取得
    const cardIds = cardsToUpdate.map((card) => card.id).filter((id) => id);

    if (cardIds.length === 0) {
      res.status(400).json({ message: 'カードIDが指定されていません' });
      return;
    }

    // 既存のCardエンティティを取得
    const existingCards = await cardRepository.findBy({
      id: In(cardIds),
    });

    // 既存データに更新データをマージ
    const mergedCards = existingCards.map((existingCard) => {
      const updateData = cardsToUpdate.find(
        (card) => card.id === existingCard.id
      );
      return {
        ...existingCard,
        ...updateData,
      };
    });

    // 一括更新
    await datasource
      .createQueryBuilder()
      .insert()
      .into(Card)
      .values(mergedCards)
      .orUpdate([
        'title',
        'description',
        'dueDate',
        'position',
        'listId',
        'completed',
      ])
      .execute();

    const updatedCards = await cardRepository.findBy({
      id: In(cardIds),
    });

    res.status(200).json(updatedCards);
  } catch (error) {
    console.error('カード更新エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

// ✅ カードを削除
cardController.delete('/:id', Auth, async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const existingCard = await cardRepository.findOne({
      where: { id },
    });

    if (!existingCard) {
      res.status(404).json({ message: 'カードが見つかりません' });
      return;
    }

    await cardRepository.delete(id);

    res.status(200).json({ message: 'カードを削除しました' });
  } catch (error) {
    console.error('カード削除エラー:', error);
    res.status(500).json({ message: 'サーバーエラーが発生しました' });
  }
});

export default cardController;
