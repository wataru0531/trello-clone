
// ✅ SortableList
// → リスト1つ

import { SortableCard } from './SortableCard';
import { AddCard } from './AddCard';
import type { List } from '../../../modules/lists/list.entity';

type SortableListProps = {
  list: List;
}

export function SortableList({ list }: SortableListProps){
  // console.log(list); // List {id: 'b53c7c1d-b7db-4cd1-ba68-ed030a8b8f5c', title: '初めてのリスト', position: 0, boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', createdAt: '2026-01-22T10:16:52.000Z', …}
  const { title } = list;

  return(
    <div>
      <div className={`list`}>
        <div 
          className="list-header"
          style={{ cursor: "grab" }}
        >
          <h3 className="list-title">{ title }</h3>
          <button className="list-options">
            <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor">
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
            </svg>
          </button>
        </div>
        
        {/*  */}
        <div style={{ minHeight: "1px" }}>
          <SortableCard />
        </div>

        {/* カードを追加ボタン */}
        <AddCard />
      </div>
    </div>
  )
}
