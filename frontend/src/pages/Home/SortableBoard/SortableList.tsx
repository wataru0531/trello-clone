
// ✅ SortableList
// → リスト1つ

import { Draggable } from "@hello-pangea/dnd";
import { useAtomValue } from "jotai";

import { SortableCard } from './SortableCard';
import { AddCard } from './AddCard';
import type { List } from '../../../modules/lists/list.entity';
import { cardsAtom } from "../../../modules/cards/card.state";

type SortableListProps = {
  list: List;
  deleteList: (id: string) => void;
  createCard: (listId: string, title: string) => Promise<void>
  errorMessage?: string | null;
}

// リスト1つ
export function SortableList({ 
  list, 
  deleteList, 
  errorMessage,
  createCard,
}: SortableListProps){
  // console.log(list); // List {id: 'b53c7c1d-b7db-4cd1-ba68-ed030a8b8f5c', title: '初めてのリスト', position: 0, boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', createdAt: '2026-01-22T10:16:52.000Z', …}
  const { id, title, position } = list;

  const cards = useAtomValue(cardsAtom); // 全てのカードを取得
  const sortedListCards = cards
                          .filter(card => card.listId == id) // → 全てのカードを、リスト1つのidに見合ったカードのみを紐づけて抽出
                          .sort((a, b) => a.position - b.position);
  // console.log(sortedListCards)

  return(
    // ✅ ドラッグする要素に指定
    <Draggable
      draggableId={ id } // 一意のid
      index={ position } // 並び順
    >
      {(provided, snapshot) => ( // snapshot → ドラッグに関する情報
        <div 
          ref={ provided.innerRef } // DnD側がこのDOMを直接操作するために指定
          { ...provided.draggableProps } // DnD側から渡ってくるプロップス
          style={{ 
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? 0.8 : 1, // ドラッグ中は透明度を上げる
          }} // DnDから渡されるスタイル
        >
          <div className={`list`}>
            <div 
              className="list-header"
              style={{ cursor: "grab" }}
              { ...provided.dragHandleProps } // 👉 ドラッグを開始できる部分
            >
              <h3 className="list-title">{ title }</h3>
              {/* 削除ボタン */}
              <button 
                className="list-options"
                onClick={ () => deleteList(id) }
              >
                <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                  <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
                </svg>
              </button>
              { errorMessage && <p className="error-message">{ errorMessage }</p> }
            </div>
            
            {/* リスト1つに紐づいているカード群 */}
            <div style={{ minHeight: "1px" }}>
              {
                sortedListCards.map((card) => {
                  // console.log(card); // Card {id: '6f3ba052-b0bb-4742-9c14-3ab38fd7b943', title: 'テストカード2', position: 0, description: null, dueDate: null, …}
                  return <SortableCard key={ card.id } card={ card }  />
                  // 👉 keyはReact内部で使う特別な属性なのでPropsとして渡らない
                })
              }
              {/* <SortableCard /> */}
            </div>

            {/* カードを追加ボタン */}
            <AddCard listId={ id } createCard={ createCard } />
          </div>
        </div>
      )}
    </Draggable>
  )
}
