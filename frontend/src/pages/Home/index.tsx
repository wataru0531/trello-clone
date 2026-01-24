
// Home > index.tsx

import { useState, useEffect } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { Navigate } from "react-router-dom";

import './Home.css';
import SortableBoard from './SortableBoard';
import { currentUserAtom } from "../../modules/auth/current-user";
import { Sidebar } from "./Sidebar";
import { listsAtom } from "../../modules/lists/list.state"; // Listsのアトム
import { listRepository } from "../../modules/lists/list.repository";

function Home() {
  const [ showSidebar, setShowSidebar ] = useState(false);
  const currentUser = useAtomValue(currentUserAtom);
  // console.log(currentUser); // User {id: '9f122c2a-6d50-4ec5-9801-9a988cd39d4a', name: 'wataru', email: 'obito0531@gmail.com', boardId: '92b5ef2c-31d0-403c-8645-7e43a15e69d8', thumbnailUrl: null, …}
  const setLists = useSetAtom(listsAtom); // 👉 リストを更新するだけのメソッド

  const onClickShowSidebar = () => setShowSidebar(true);
  const onClickCloseSidebar = () => setShowSidebar(false);

  // ✅ リストを取得してグローバルステートに保持
  const fetchLists = async () => {
    const lists = await listRepository.find(currentUser!.boardId); // ! ... 非null断言演算子
                                                                   //       これは絶対にnull / undefinedではない
    setLists(lists); // 👉 グローバルステートに保持。更新用関数                             
  }

  useEffect(() => {
    fetchLists();
  }, [ currentUser ]); // ログインしているユーザーが変わればboardIdも変わるのでlistsのデータを取得しなおす

  if(currentUser == null) return <Navigate to="/signin" replace={ true } />
  
  return (
    <div>
      {/* ヘッダー */}
      <header className="header">
        <div className="header-left">
          <button 
            className="apps-button"
            onClick={ onClickShowSidebar }
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M4 6h16v2H4V6zm0 5h16v2H4v-2zm0 5h16v2H4v-2z" />
            </svg>
          </button>
          <div className="trello-logo">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M21 0H3C1.343 0 0 1.343 0 3v18c0 1.657 1.343 3 3 3h18c1.657 0 3-1.343 3-3V3c0-1.657-1.343-3-3-3zM10.44 18.18c0 .795-.645 1.44-1.44 1.44H4.56c-.795 0-1.44-.645-1.44-1.44V5.82c0-.795.645-1.44 1.44-1.44H9c.795 0 1.44.645 1.44 1.44v12.36zm10.44-6.24c0 .795-.645 1.44-1.44 1.44H15c-.795 0-1.44-.645-1.44-1.44V5.82c0-.795.645-1.44 1.44-1.44h4.44c.795 0 1.44.645 1.44 1.44v6.12z" />
            </svg>
            Trello
          </div>
        </div>
      </header>

      {/* ボードヘッダー */}
      <div className="board-header">
        <h1 className="board-title">マイボード</h1>
      </div>

      {/* リスト */}
      <SortableBoard />

      {/* サイドバー(メニュー) */}
      { showSidebar && <Sidebar onClickCloseSidebar={ onClickCloseSidebar } /> }

      {/* <CardModal /> */}
    </div>
  );
}

export default Home;
