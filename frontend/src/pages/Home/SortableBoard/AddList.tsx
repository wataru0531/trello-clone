
// ✅ リストを追加するボタン

import { useState } from "react";

type AddListProps = {
  createList: (title: string) => Promise<void>
}

export function AddList({ createList }: AddListProps) {
  const [ showInput, setShowInput ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState("");

  const onClickChancel = () => {
    setShowInput(false);
    setTitle("");
  }

  // 
  const onSubmitCreateList = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(title === "") return;

    try {
      await createList(title);

    } catch(e) {
      console.log("リストの制作に失敗しました。", e);
      setErrorMessage("リストの制作に失敗しました。");
    } finally {
      setTitle("");
      setShowInput(false);
    }

  }

  if(!showInput) {
    return (
      <button 
        className="add-list-button"
        onClick={() => setShowInput(true)}
      >＋ もう1つリストを追加</button>
    )
  }

  return (
    <form 
      className="add-list-form"
      onSubmit={ onSubmitCreateList }
    >
      <input
        type="text"
        placeholder="リスト名を入力..."
        className="add-list-input"
        autoFocus
        value={ title }
        onChange={(e) => setTitle(e.target.value)}
      />
      <div className="add-list-actions">
        <button 
          type="submit"
          className="add-list-submit"
        >リストを追加</button>
        <button 
          className="add-list-cancel"
          onClick={ onClickChancel }
        >×</button>
      </div>
      {  errorMessage && <p className="error-message">リストの追加に失敗しました。</p>}
    </form>
  );
}
