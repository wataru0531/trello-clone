
// ✅ リストに関する状態

// 
import { atom } from "jotai";
import { List } from "./list.entity";


export const listsAtom = atom<List[]>([]);

