
// ✅ カードの状態を定義
// → jotaiでは複数の状態を保持できる

import { atom } from "jotai";
import { Card } from "./card.entity";

export const cardsAtom = atom<Card[]>([]);