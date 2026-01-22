
// ✅ list.entity.ts
// → リストに関するエンティティ

export class List {
  id!: string;
  title!: string;
  position!: number;

  constructor(data: List) {
    Object.assign(this, data);
  }
}



