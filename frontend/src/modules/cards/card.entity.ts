
// ✅ カードのエンティティ
// カード ... リストの中に複数存在
// ここでは単純に型定義用のクラス

// エンティティとは？
// DBの1行(レコード)を、TypeScriptのクラスとして表現したもの

// 一般的にエンティティとは、DB（cardsテーブル）があったら：id	title	position	list_id	completed
// これをバックエンド側で扱いやすくしたものが Entity。

// Entityの役割
// ・DBの構造をコードで表す
// ・型安全にデータを扱える
// ・ORM（TypeORMなど）が保存、取得、更新を自動でやってくれる

export class Card {
  // ! →「実行時には必ず入る」という開発者の約束
  id!: string;
  title!: string;
  position!: string;
  description!: string;
  dueDate!:string;
  completed!: boolean;
  listId!: string;

  constructor(data: Card) {
    Object.assign(this, data);  
  }

}





