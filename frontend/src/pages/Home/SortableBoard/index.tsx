
// ✅ SortableBoard

// DragDropContext（全体）... ドラッグ＆ドロップ全体を管理する親コンテナ
//  └ Droppable（ドロップできる場所）
//     └ Draggable（つかんで動かせる物）

import { useState } from "react";
import { SortableList } from './SortableList';
import { AddList } from './AddList';
import { useAtom, useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../modules/auth/current-user';
import { listRepository } from '../../../modules/lists/list.repository';
import { listsAtom } from '../../../modules/lists/list.state';
import { DragDropContext, Droppable, type DropResult }from "@hello-pangea/dnd";
import { cardRepository } from "../../../modules/cards/card.repository";


function SortableBoard(){
  const currentUser = useAtomValue(currentUserAtom);
  const [ lists, setLists ] = useAtom(listsAtom);
  const sortedLists = [...lists].sort((a, b) => a.position - b.position ); // → 昇順に並べ替え
  // sort → a - b を繰り返し、プラスなら前に並べ変えていく
  const [ errorMessage, setErrorMessage ] = useState<string | null>("");

  // ✅ リストを追加 ... リストを1つ生成 + グローバルステートを更新
  // → このコンポーネントでは状態を保つので、更新関数もここで持つ
  //   👉 仮想のAddListでは状態を直接持たず、親から渡された更新のきっかけを呼ぶだけ。
  const createList = async (title: string) => {
    //  ! → currentUserは絶対にnull / undefined ではないのでエラーが出すなとtsに指示
    const newList = await listRepository.create(currentUser!.boardId, title);
    // console.log(newList); // List {id: '21c84dc2-75e3-4ef4-9be8-e2ab753d4c24', title: 'テストカード2', position: 2, boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', createdAt: '2026-01-22T10:21:04.000Z', …}

    setLists((prevLists) => [...prevLists, newList]); // 👉 グローバルステートを更新
  }

  // ✅ リストを削除
  const deleteList = async (listId: string) => {
    const confirmMessage = "リストを削除しますか？このリスト内のカードもすべて削除されます。";

    try {
      if(window.confirm(confirmMessage)){
        await listRepository.delete(listId);
        setLists((prevLists) => prevLists.filter((list) => list.id !== listId));
        // → グローバルステートを更新
      }

      setErrorMessage(null);
    } catch (e) {
      console.error("リストの削除に失敗しました", e);
      setErrorMessage("リストの削除に失敗しました");
    }
  }

  // ✅ ドラッグで並び替えられた順番を、配列として作り直して、stateに保存
  // 👉 移動後に発火
  const handleDragEnd = async (result: DropResult) => {
    const { source, destination } = result; // source:移動元の情報、destination:移動先の情報
                                            
    if(destination === null) return; // ドラッグしたが、ドラッグ可能エリア外で離したなど

    // 動かしたリストを一旦、配列から1つだけ抜き取る
    const [ reorderedList ] = sortedLists.splice(source.index, 1);
    // console.log(reorderedList); // List {id: 'cd3178fb-1e2f-4f42-b428-7c2dbed63d6b', title: 'テストカード3', position: 3, boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', createdAt: '2026-01-23T13:38:19.000Z', …}

    // ✅ 移動先に差し込む 👉 移動先の index の位置に、ドラッグしたリストを挿入
    // destination.index → 挿入したい位置
    // 0 → 何も削除せず
    // reorderedList → 挿入する要素
    sortedLists.splice(destination.index, 0, reorderedList);

    // const array = ["A", "C", "B"]; // 👉 spliceの基本
    // array.splice(1, 0, "B");
    // console.log(array); // (4) ['A', 'B', 'C', 'B']

    // ✅ 最終的な順番に合わせて position を振り直す
    const updatedLists = sortedLists.map((list, idx) => { 
      return {
        ...list,
        position: idx, // ここで更新、上書き
      }
    });

    const originalLists = [ ...lists ]; // 更新に失敗した時に使う
    setLists(updatedLists); // 👉 グローバルステートを更新(上書き)

    // ✅ DBの中も更新していく
    try {
      await listRepository.update(updatedLists);

    } catch(e) {
      console.error("リストの更新に失敗しました。", e);
      setLists(originalLists); // 👉 失敗した場合は元のリストの配列をいれてやる
    }
  }

  // ✅ カードを作る処理　→ AddCardで発火させる
  const createCard = async (listId: string, title: string) => {
    const newCard = await cardRepository.create(listId, title);
    // console.log(newCard); // Card {id: '6f3ba052-b0bb-4742-9c14-3ab38fd7b943', title: 'テストカード2', position: 0, description: null, dueDate: null, …}
  }

  return(
    // ドラッグ＆ドロップ全体を管理する親コンテナ
    <DragDropContext onDragEnd={ handleDragEnd }>
      <div className="board-container">
        {/* 置き場所。「ここにドロップしていいよ」というエリア */}
        <Droppable
          droppableId="board" // エリアの識別子(必須)
          type="list" // 同じtypeのDraggableだけが入れる
          direction="horizontal" // リストを横方向に並び替える
        >
          {
            // ⭐️ DnDライブラリが渡してくるツールセットみたいなもの
            ((provided) => (
              <div 
                style={{ display: "flex", gap: "12px" }}
                { ...provided.droppableProps } // Droppableとして必要なイベント・属性
                ref={ provided.innerRef } // 👉 このDOMをライブラリが操作するために指定必須
              >
                {/* リスト */}
                {
                  sortedLists.map(list => (
                    <SortableList 
                      key={ list.id } 
                      list={ list } 
                      deleteList={ deleteList }
                      createCard={ createCard }
                      errorMessage={ errorMessage }
                    />
                  ))
                }
                { provided.placeholder }
                {/* → ドラッグ中にレイアウトが崩れないためのダミー要素 */}
              </div>
            ))
          }
        </Droppable>

        {/* ✅ リストを追加するボタン */}
        <AddList createList={ createList } />
      </div>
    </DragDropContext>
  )
}

export default SortableBoard;