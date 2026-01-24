
// ✅ list.entity.ts
// → リストに関するエンティティ
// クラスであり、型

export class List {
  id!: string;
  title!: string;
  position!: number;

  constructor(data: List) {
    Object.assign(this, data);
  }
}
