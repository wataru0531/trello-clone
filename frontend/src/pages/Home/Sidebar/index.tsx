
// ✅ Sidebar > index.tsx
// TODO formに置き換える

import { useState } from "react";
import { useAtomValue, useSetAtom } from "jotai";
import { currentUserAtom } from "../../../modules/auth/current-user";
import { accountRepository } from "../../../modules/account/account.repogitory";

type SidebarProps = {
  onClickCloseSidebar: () => void
}

export const Sidebar: React.FC<SidebarProps> = ({ onClickCloseSidebar }) => {
  const currentUser = useAtomValue(currentUserAtom); // 読み取り専用
  const setCurrentUser = useSetAtom(currentUserAtom); // 更新専用

  const [ isEditing, setIsEditing ] = useState(false);
  const [ editName, setEditName ] = useState(currentUser?.name ?? "");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

  const onStartEditing = () => { // 編集開始。✏️クリック
    setEditName(currentUser?.name ?? "");
    setIsEditing(true);
  }

  const onCancelEditing = () => { // 編集中止
    setErrorMessage(null);
    setIsEditing(false);
  }

  // ✅ ユーザー名を更新
  const onSubmitUpdateUserName = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(!editName.trim()) { // ユーザー名が空の時
      setErrorMessage("ユーザー名を入力してください。");
      return;
    }

    try {
      setIsSubmitting(true);
      setErrorMessage(null);
      const updatedUser = await accountRepository.updateProfile(editName);

      setCurrentUser(updatedUser);
      setIsEditing(false);
    } catch(e) {
      console.error("ユーザーの更新に失敗しました。", e);
      setErrorMessage("ユーザーの更新に失敗しました。");
    } finally {
      setIsSubmitting(false);
    }
  }

  // ✅ ログアウト
  const onClickLogout = () => {
    localStorage.removeItem("token");
    setCurrentUser(undefined);
  }

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
            // showInput ? (
            isEditing ? (
              // 👉 編集
              <form className="sidebar-edit-form" onSubmit={ onSubmitUpdateUserName }>
                <input
                  type="text"
                  name="name"
                  placeholder="ユーザー名を入力"
                  className="sidebar-name-input"
                  autoFocus
                  maxLength={20}
                  value={ editName }
                  onChange={ (e) => setEditName(e.target.value) }
                />
                <div className="sidebar-edit-actions">
                  <button
                    type="submit"
                    className="sidebar-save-button"
                    disabled={ isSubmitting }
                  >
                    { isSubmitting ? "...isSubmitting" : "保存" }
                  </button>
                  <button 
                    className="sidebar-cancel-button"
                    // onClick={ onClickSetCloseInput }
                    onClick={ onCancelEditing }
                  >
                    キャンセル
                  </button>
                </div>
                { errorMessage && <p className="error-message">{ errorMessage }</p> }
              </form>
              ) : (
                // 👉 デフォルト
                <div className="sidebar-user-info">
                  <div className="sidebar-user-name" title="プロフィールを編集">
                    {/* { name } */}
                    { currentUser?.name ?? "ユーザー" }
                  </div>
                  <button 
                    className="sidebar-edit-button" 
                    title="プロフィールを編集"
                    onClick={ onStartEditing }
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
              <span 
                className="sidebar-board-name"
                onClick={ onClickLogout }
              >ログアウト</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};
