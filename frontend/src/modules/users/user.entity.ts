

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
  // → これらのプロパティ宣言がなくても型としてこのクラスは使えるが意味のない型になる
  // → ⭐️ TypeScriptファイルでのみ可能。
  id!: string; // ! = 「後で必ず代入されるから、未初期化でも怒らないでということ
  name!: string;
  email!: string;
  boardId!: string; // → ⭐️ ユーザー１つに対してボードの部屋ができる
                    //      このboardIdの中に、List、カードなどを作っていく

  constructor(data: User) {
    // ✅ 自己参照型 ... Userの中でdataをUser型にする
    Object.assign(this, data); // dataの中をthisにそのままコピーする
  }
}

