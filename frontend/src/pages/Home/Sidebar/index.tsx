
// ✅ Sidebar

import { useState } from "react";
import { useAtom } from "jotai";
import { currentUserAtom } from "../../../modules/auth/current-user";

type SidebarProps = {
  onClickCloseSidebar: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onClickCloseSidebar }) => {
  const [ currentUser, setCurrentUser ] = useAtom(currentUserAtom);
  // console.log(currentUser);

  const [ name, setName ] = useState(currentUser?.name ? currentUser?.name : "ユーザー")
  const [ showInput, setShowInput ] = useState(false);

  const onClickSetShowInput = () => setShowInput(true);
  const onClickSetCloseInput = () => setShowInput(false);

  return (
    <>
      <div 
        className="sidebar-overlay" 
        onClick={ onClickCloseSidebar }
      />
      <div className="sidebar">
        <div className="sidebar-header">

          <button 
            className="sidebar-close-button"
            onClick={ onClickCloseSidebar }
          >×</button>

          {
            showInput ? (
              // 👉 編集
              <div className="sidebar-edit-form">
                <input
                  type="text"
                  placeholder="ユーザー名を入力"
                  className="sidebar-name-input"
                  autoFocus
                  maxLength={20}
                />
                <div className="sidebar-edit-actions">
                  <button className="sidebar-save-button">保存</button>
                  <button 
                    className="sidebar-cancel-button"
                    onClick={ onClickSetCloseInput }
                  >キャンセル</button>
                </div>
              </div>
              ) : (
                // 👉 デフォルト
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name" title="プロフィールを編集">
                    { name }
                  </div>
                  <button 
                    className="sidebar-edit-button" 
                    title="プロフィールを編集"
                    onClick={ onClickSetShowInput }
                  >
                    ✏️
                  </button>
                </div>
              )
          }

        </div>

        <div className="sidebar-content">
          <div className="sidebar-section">
            <button className="sidebar-board-item">
              <span className="sidebar-board-name">ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
