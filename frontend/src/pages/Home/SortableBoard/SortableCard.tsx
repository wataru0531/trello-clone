
// ✅ SortableCard
// → SortableListの中にあるカード1つを示す

import { useSetAtom } from "jotai";
import type { Card } from "../../../modules/cards/card.entity";
import { selectedCardIdAtom } from "../../../modules/cards/card.state";

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
  const { id, title } = card;
  const datetime = "2025-06-08";

  const setSelectedCardId = useSetAtom(selectedCardIdAtom); // 選択したカードのid


  return (
    <div>
      <div 
        className={`card`} 
        onClick={ () => setSelectedCardId(id) }
      >
        <div className="card-title">
          <span className="card-check">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="#4CAF50">
              <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" />
            </svg>
          </span>
          { title }
        </div>
        {/* <div className="card-badge">🕒 { dueDate }</div> */}
        <time dateTime={ datetime } className="card-badge">🕒 { datetime }</time>
      </div>
    </div>
  );
}
