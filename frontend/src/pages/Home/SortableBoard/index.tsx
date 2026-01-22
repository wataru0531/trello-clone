

import { SortableList } from './SortableList';
import { AddList } from './AddList';
import { useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../modules/auth/current-user';
import { listRepository } from '../../../modules/lists/list.repository';


function SortableBoard(){
  const currentUser = useAtomValue(currentUserAtom);

  const createList = async (title: string) => {
    //  ! → currentUserは絶対にnull / undefined ではないのでエラーが出すなと指示
    const newList = await listRepository.create(currentUser!.boardId, title);
    // console.log(newList);
    // List {id: '21c84dc2-75e3-4ef4-9be8-e2ab753d4c24', title: 'テストカード2', position: 2, boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', createdAt: '2026-01-22T10:21:04.000Z', …}

  }

  return(
    <div className="board-container">
      <div style={{ display: "flex", gap: "12px" }}>
        <SortableList />
      </div>

      {/* リストを追加するボタン */}
      <AddList createList={ createList } />
      
    </div>
  )
}

export default SortableBoard;



