
// current-user.ts

// ✅ Jotai = 超シンプルなグローバル state 管理ライブラリ
// React公式 useState の延長線
// Redux より圧倒的に軽い
// Context より書きやすい
// 「状態を小さな単位（atom）で管理」する思想
// 👉 状態管理の粒度が小さいのが最大の特徴


import { atom } from "jotai";

import type { User } from "../users/user.entity";

// ✅ atom → 状態の最小単位
export const currentUserAtom = atom<User>();

// ✅ 使い方の例
// 状態の登録
// const [ currentUser, setCurrentUser ] = useAtom(currentUserAtom);

// 状態の取得
// const currentUser = useAtomValue(currentUserAtom);

// atom の値を「変更するためだけの関数」を取得する
// const setCurrentUser = useSetAtom(currentUserAtom);

