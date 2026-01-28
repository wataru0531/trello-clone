
// ✅ カードの状態を定義
// → jotaiでは複数の状態を保持できる

import { atom } from "jotai";
import { Card } from "./card.entity";

// ✅ カードに関する実データ
export const cardsAtom = atom<Card[]>([]);

// ⭐️ 選択したカードのidをグローバルで持つ、何も選択しなければnull
export const selectedCardIdAtom = atom<string | null>(null);

// ✅ 選択したカード
// → 派生atom
//    → 読み取り専用。更新できない。依存しているatomの状態が更新されたら自動的に更新される。
//      自分では状態を持たない。
// ⭐️ selectedCardIdAtom や cardsAtomにどこかのコンポーネントで変更があった場合は動的に変わる
//    → 依存しているので
export const selectedCardAtom = atom((get) => {
  const selectedCardId = get(selectedCardIdAtom); // 選択したカードのid
  
  const cards = get(cardsAtom); // 全カードを取得

  // idに一致するカードがあれば返す 
  // 👉 状態が重複しない、常に最新のカードが取れる、自動計算
  return selectedCardId != null ? cards.find(card => card.id == selectedCardId)
                                : null;
})

