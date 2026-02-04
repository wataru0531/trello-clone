
// ✅ SortableCard
// → SortableListの中にあるカード1つを示す

import { useSetAtom } from "jotai";
import type { Card } from "../../../modules/cards/card.entity";
import { selectedCardIdAtom } from "../../../modules/cards/card.state";
import { Draggable } from "@hello-pangea/dnd";

type SortableCardProps = {
  card: Card;
}

// export class Card {
//   id!: string;
//   title!: string;
//   position!: string;
//   description!: string;
//   dueDate!:string;
//   completed!: boolean;
//   listId!: string;

//   constructor(data: Card) {
//     Object.assign(this, data);  
//   }
// }

// 1つのカード
export function SortableCard({ card }: SortableCardProps) {
  // console.log(card); // Card {id: 'f80c18ff-9f4e-4428-9bed-ff38c29e66f3', title: 'テストカード2-3', position: 1, description: null, dueDate: null,createdAt: "2026-01-28T14:03:39.000Z" …}
  const { id, title, completed, dueDate, position } = card;

  // const date = new Date(card.createdAt);
  // console.log(date); // Tue Jan 27 2026 17:08:12 GMT+0900 (日本標準時)

  const setSelectedCardId = useSetAtom(selectedCardIdAtom); // 選択したカードのid

  return (
    <Draggable 
      draggableId={ id } 
      index={ position }
    >
      {(provided, snapshot) => (
        <div 
          ref={ provided.innerRef }
          { ...provided.draggableProps }
          { ...provided.dragHandleProps }
          style={{ 
            ...provided.draggableProps.style,
            opacity: snapshot.isDragging ? .5 : 1, // ドラッグ中は透明度を下げる
          }}
        >
          <div 
            className={`card`} 
            onClick={ () => setSelectedCardId(id) }
          >
            <div className="card-title">
              {
                completed && (
                  <span className="card-check">
                    <svg viewBox="0 0 24 24" width="16" height="16" fill="#4CAF50">
                      <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
                    </svg>
                  </span>
                )
              }
              { title }
            </div>
              {
                dueDate && (
                  <time 
                    dateTime={ dueDate } 
                    className="card-badge"
                  >🕒 { dueDate }</time>
                  // ✅ datetimeタグ → ISO形式 (国際標準企画)
                  // ✅ 人間への表示はLocale → 形式
                )
              }
            
          </div>
        </div>
      )}
      
    </Draggable>
  );
}
