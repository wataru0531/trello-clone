
// ✅　カードを追加するコンポーネント
// SortableBoard(index.ts) > SortableList > AddCard
// TODO Formタグに変更

import { useState } from "react";

type AddCardProps = {
  listId: string;
  createCard: (listId: string, title: string) => Promise<void>
}

export function AddCard({ listId, createCard }: AddCardProps) {
  const [ showInput, setShowInput ] = useState(false);
  const [ title, setTitle ] = useState("");
  const [ errorMessage, setErrorMessage ] = useState<string | null>(null);

  if(!showInput) {
    return (
      <button 
        className="add-card-button"
        onClick={() => setShowInput(true)}
      >＋ カードを追加</button>
    )
  }

  const onSubmitCreateCard = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if(title === "") return;

    try {
      await createCard(listId, title);
    } catch(e) {
      console.error(e);
      setErrorMessage("カードの作成に失敗しました。")
    } finally {
      setTitle("");
      setShowInput(false);
      setErrorMessage(null);
    }
  }

  return (
    <form
      onSubmit={ onSubmitCreateCard } 
      className="add-card-form"
    >
      <textarea
        placeholder="タイトルを入力するか、リンクを貼り付ける"
        autoFocus
        value={ title } // textareaはアンマウントされるが、AddCard自体はアンマウントされていないので残る
        onChange={ (e) => setTitle(e.target.value) }
      />
      <div className="add-card-form-actions">
        <button type="submit" className="add-button">
          カードを追加
        </button>
        <button 
          type="button" 
          className="cancel-button"
          onClick={ () => setShowInput(false) }
        >✕</button>
      </div>
      { errorMessage && <div>{ errorMessage }</div> }
    </form>
  );
}
