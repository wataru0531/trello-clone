
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
import { DragDropContext, Droppable, type DraggableLocation, type DropResult }from "@hello-pangea/dnd";
import { cardRepository } from "../../../modules/cards/card.repository";
import { cardsAtom } from "../../../modules/cards/card.state";
import type { Card } from "../../../modules/cards/card.entity";


function SortableBoard(){
  const currentUser = useAtomValue(currentUserAtom);
  const [ lists, setLists ] = useAtom(listsAtom);
  const [ cards, setCards ] = useAtom(cardsAtom);

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

  // ✅ ドラッグ終了時の処理
  // → リスト、カードとで処理を分けていく
  const handleDragEnd = async (result: DropResult) => {
    // console.log(result); // {draggableId: 'f80c18ff-9f4e-4428-9bed-ff38c29e66f3', type: 'card', source: {…}, reason: 'DROP', mode: 'FLUID', …}
    const { source, destination, type, draggableId } = result;
    // console.log(source, destination, type); // 元の情報、ドロップ先の情報、対象カードのid

    if(destination == null) return; // ドロップ先がない場合(ドロップ可能エリア外など)は処理を中観

    // 👉 リストを移動した時の処理
    if(type == "list") { // 👉 type ... Droppable に指定したtype
      await handleListMove(source, destination);
      return;
    }

    // 👉 カードを動かした場合の処理 → 同じカード内か、違うカードを跨ぐのかで分岐
    if(type == "card") {
      // draggableId → 移動対象のカードのid。カード1つをラップしているid
      // console.log(draggableId);
      await handleCardMove(draggableId, source, destination);
    }
  }

  // ✅ カードを動かした場合の処理 → 同じカード内か、違うカードを跨ぐのかで分岐させる処理
  const handleCardMove = async (
    cardId: string, //  移動対象のカードのid。
    source: DraggableLocation,
    destination: DraggableLocation
  ) => {
    const targetCard = cards.find(card => card.id == cardId); // 移動対象のカードを取得
    if(targetCard == null) return cards;

    const originalCards = [ ...cards ]; 

    try {
      // droppableId: 動かすカード群の全体のid。draggableId: 動かすカードのid
      const updatedCards = source.droppableId == destination.droppableId // 👉 同じカード内を動いた時
                ? moveCardInSameList(source, destination) // 同じカード内の処理
                : moveCardBetweenLists(source, destination, targetCard); // リストを跨いだ時の動き

      setCards(updatedCards); // 👉 グローバルステートを更新

      // ⭐️ DBを更新していく
      await cardRepository.update(updatedCards);

    } catch(e) {
      console.error("カードの移動に失敗しました。", e);
      setCards(originalCards); // 失敗した場合は元のカード配列を入れる
    }
    
  }

  // ✅ カードをリスト間を跨いで動かした時の処理
  const moveCardBetweenLists = (
    source: DraggableLocation,
    destination: DraggableLocation,
    card: Card
  ) => {
    // 移動元のカード群のリストから移動対象のカードを削除 = 移動対象以外のカードが入っていないリストを取得
    const sourceListCards = cards.filter((c) => {
      // 全てのカードの中から、移動対象のカードがあるリスト
      // → ⭐️ 移動対象のカードも取得してまうのでそれは入れない
      return c.listId == source.droppableId && c.id !== card.id
    }).sort((a, b) => a.position - b.position); // 昇順

    const updatedCards = updateCardsPosition(cards, sourceListCards); // インデックスを修正

    // 移動先に含まれているカード一覧を取得
    const destinationListCards = updatedCards.filter(c => c.listId == destination.droppableId)
                                  .sort((a, b) => a.position - b.position);

    // 移動先のリストに移動対象のカードを入れていく
    destinationListCards.splice(destination.index, 0, { ...card, listId: destination.droppableId });

    return updateCardsPosition(updatedCards, destinationListCards);
  }

  // ✅ カードをリスト内で動かした時の処理
  const moveCardInSameList = (
    source: DraggableLocation, // 元の位置などの情報
    destination: DraggableLocation // ドロップ先の情報
  ) => {
    // console.log(cards)
    const listCards = cards  // 同じリスト内のカードを取得
                      .filter(card => card.listId == source.droppableId) // droppableId → エリアの識別子
                      .sort((a, b) => a.position - b.position); // 昇順に並べ替え

    const [ removed ] = listCards.splice(source.index, 1); // 選択したカードを元のリストから削除
    listCards.splice(destination.index, 0, removed); // それをドロップ先のインデックスに差し込む

    const updatedCards = updateCardsPosition(cards, listCards); // 👉 positionを更新
    return updatedCards; 
  }

  // ✅ 更新後のカードの配列の position を更新して、全てのカードの配列を返す
  // cards → グローバルステートのカード全体の配列
  // updatedCards → 更新対象のカードを含めたそのリスト内のカード全ての配列
  //                👉 既に新しい順には並び替えられている
  //                しかし、positionのみが更新されていない状態
  const updateCardsPosition = (cards: Card[], updatedCards: Card[]) => {
    return cards.map(card => {
      // ✅ 全体のカードの中に、更新対象のカードが含まれているかどうかを検証し、
      //    そして、そのインデックスを返す
      const cardIndex = updatedCards.findIndex(c => c.id == card.id);

      return cardIndex !== -1 // 👉 存在する場合は1、存在しない場合は-1を返す
      ? {
          ...updatedCards[cardIndex], // ⭐️ 更新対象のカード情報を展開しつつ、positionも更新する
          position: cardIndex,
        }
      : card; // インデックスが-1の時 → updatedCardsに含まれていないカードなので更新の必要なし
    })
  }

  // ✅ ドラッグで並び替えられた順番を、配列として作り直して、stateに保存
  // 👉 移動後に発火
  const handleListMove = async ( 
    source: DraggableLocation,  // source:移動元の情報、destination:移動先の情報
    destination: DraggableLocation,
  ) => {                    
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

    try { // ✅ DBの中も更新していく。→ フロントとDBは違う。フロントだけ更新してもDBを更新してないのでリロードすると元に戻る
      await listRepository.update(updatedLists);

    } catch(e) {
      console.error("リストの更新に失敗しました。", e);
      setLists(originalLists); // 👉 失敗した場合は元のリストの配列をいれてやる
    }
  }

  // ✅ カードを作る処理　→ AddCardで発火させる。リスト1つづつに持たせる
  const createCard = async (listId: string, title: string) => {
    const newCard = await cardRepository.create(listId, title);
    // console.log(newCard); // Card {id: '6f3ba052-b0bb-4742-9c14-3ab38fd7b943', title: 'テストカード2', position: 0, description: null, dueDate: null, …}
  
    // グローバルステートを更新 → レンダリングされるので更新する
    setCards(prevCards => [...prevCards, newCard]);
  }

  return(
    // ドラッグ＆ドロップ全体を管理する親コンテナ
    // → ここではリスト、カードを動かしていく
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