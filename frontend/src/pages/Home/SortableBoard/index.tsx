
// ✅ SortableBoard

import { SortableList } from './SortableList';
import { AddList } from './AddList';
import { useAtom, useAtomValue } from 'jotai';
import { currentUserAtom } from '../../../modules/auth/current-user';
import { listRepository } from '../../../modules/lists/list.repository';
import { listsAtom } from '../../../modules/lists/list.state';


function SortableBoard(){
  const currentUser = useAtomValue(currentUserAtom);
  const [ lists, setLists ] = useAtom(listsAtom);
  const sortedLists = [...lists].sort((a, b) => a.position - b.position ); // → 昇順に並べ替え
  // sort → a - b を繰り返し、プラスなら前に並べ変えていく

  // ✅ リストを1つ生成して新しい配列をつくる処理
  const createList = async (title: string) => {
    //  ! → currentUserは絶対にnull / undefined ではないのでエラーが出すなとtsに指示
    const newList = await listRepository.create(currentUser!.boardId, title);
    // console.log(newList); // List {id: '21c84dc2-75e3-4ef4-9be8-e2ab753d4c24', title: 'テストカード2', position: 2, boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', createdAt: '2026-01-22T10:21:04.000Z', …}

    setLists((prevLists) => [...prevLists, newList]); // 👉 グローバルステートを更新
  }

  return(
    <div className="board-container">
      <div style={{ display: "flex", gap: "12px" }}>
        {/* リストの集合 */}
        {
          sortedLists.map(list => (
            <SortableList key={list.id} list={ list } />
          ))
        }
      </div>

      {/* リストを追加するボタン */}
      <AddList createList={ createList } />
      
    </div>
  )
}

export default SortableBoard;



