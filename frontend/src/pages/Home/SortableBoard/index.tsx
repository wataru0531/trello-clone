
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
  const handleDragEnd = (result: DropResult) => {
    const { source, destination } = result; // source:移動元の情報、destination:移動先の情報
                                            
    if(destination === null) return; // ドラッグしたが、ドラッグ可能エリア外で離したなど

    // 動かしたリストを一旦、配列から1つだけ抜き取る
    const [ reorderedList ] = sortedLists.splice(source.index, 1);
    // console.log(reorderedList); // List {id: 'cd3178fb-1e2f-4f42-b428-7c2dbed63d6b', title: 'テストカード3', position: 3, boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', createdAt: '2026-01-23T13:38:19.000Z', …}

    // ✅ 移動先に差し込む
    // destination.index → 移動先のindexの位置
    // 0 → 何も削除せず
    // reorderedList → 動かしたリストを挿入
    sortedLists.splice(destination.index, 0, reorderedList);

    const updatedLists = sortedLists.map((list, idx) => { // 👉 positionを全部降り直す
      return {
        ...list,
        position: idx, // ここで更新
      }
    });

    setLists(updatedLists); // グローバルステートを更新
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
                ref={ provided.innerRef } // このDOMをライブラリが操作するために指定必須
              >
                {/* リストの集合 */}
                {
                  sortedLists.map(list => (
                    <SortableList 
                      key={list.id} 
                      list={ list } 
                      deleteList={ deleteList }
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

        {/* リストを追加するボタン */}
        <AddList createList={ createList } />
      </div>
    </DragDropContext>
  )
}

export default SortableBoard;