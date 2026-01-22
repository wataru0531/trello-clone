
// list.repository.ts
// → リストに関する処理

import api from "../../lib/api";
import { List } from "./list.entity";


export const listRepository = {
  async create(
    boardId: string, // Userに定義したこのIdにリスト、カードを作っていく
    title: string,
  ): Promise<List>{
    const result = await api.post("/lists", { 
      boardId: boardId,
      title: title,
    });

    return new List(result.data);
  },




}