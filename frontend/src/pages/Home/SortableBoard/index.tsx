

import { SortableList } from './SortableList';
import { AddList } from './AddList';


function SortableBoard(){
  return(
    <div className="board-container">
      <div style={{ display: "flex", gap: "12px" }}>
        <SortableList />
      </div>

      {/* リストを追加するボタン */}
      <AddList />
      
    </div>
  )
}

export default SortableBoard;



