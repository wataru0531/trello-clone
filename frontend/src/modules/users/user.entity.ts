

// ✅ 認証関係のクラス

// Userという形のデータを受け取って、そのまま自分自身にコピーする
// → 実際に期待されている形
// const data = {
//   id: "1",
//   name: "Taro",
//   email: "taro@example.com",
//   boardId: "board-1"
// };

export class User {
  // クラスで使うプロパティ宣言 + このクラスが持つ型情報を定義
  // → ⭐️ TypeScriptファイルでのみ可能
  id!: string;
  name!: string;
  email!: string;
  boardId!: string;

  constructor(data: User) {
    // ✅ 自己参照型 ... Userの中でdataをUser型にする
    Object.assign(this, data); // dataの中をthisにそのままコピーする
  }
}

