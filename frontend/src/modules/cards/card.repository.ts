

// ✅ card.repository.ts


import api from "../../lib/api";
import { Card } from "./card.entity";


export const cardRepository = {
  // ✅ カードを作成
  async create(listId: string, title: string): Promise<Card> { // listId → どのリストにカードが入っているかどうか
    const result = await api.post("/cards", { listId, title });
    return new Card(result.data);
  },
  // ✅ 特定のカードを取得
  async find(boardId: string) {
    const result = await api.get(`/cards/${boardId}`);

    return result.data.map((card: Card) => new Card(card))
  }


}
