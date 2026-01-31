
// ✅ CardModal
// → カードをクリックした時に表示

import { useState } from "react";
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { cardsAtom, selectedCardAtom, selectedCardIdAtom } from "../../../modules/cards/card.state";
import { cardRepository } from "../../../modules/cards/card.repository";
import type { Card } from "../../../modules/cards/card.entity";


export const CardModal = () => {
  const [ selectedCardId, setSelectedCardId ] = useAtom(selectedCardIdAtom);
  // SortableCardのカードを選択 → card.state.tsで更新 → idがここで取れる
  // console.log(selectedCardId);
  const setCards = useSetAtom(cardsAtom); // 更新用の関数
  const selectedCard = useAtomValue(selectedCardAtom); // 選択しているカード
  const [ title, setTitle ] = useState(selectedCard?.title || "");
  const [ description, setDescription ] = useState(selectedCard?.description || "");
  const [ dueDate, setDueDate ] = useState(selectedCard?.dueDate || "");
  const [ completed, setCompleted ] = useState(selectedCard?.completed || false);

  // ✅ カードを更新
  const updateCard = async () => {
    try {
      const card = {
        ...selectedCard,
        title,
        description,
        dueDate,
        completed,
      };

      const updatedCard = await cardRepository.update([ card ]);
      // → 更新された後のcard情報

      setCards(prevCards => {
        return prevCards.map(card => {
          return card.id == updatedCard[0].id ? updatedCard[0] : card 
          // → 更新したカードのidと同じものは更新後のカードを返す
          // → 更新対象ではないカードに関してはそのまま返す
        })
      });

      setSelectedCardId(null);
    } catch(e) {
      console.error("カードの更新に失敗しました。", e)
    }
    
  }

  // ✅ カードを削除
  const deleteCard = async () => {
    const confirmMessage = "カードを削除しますか？この操作は取り消せません。";
    try {
      if(window.confirm(confirmMessage)) {
        await cardRepository.delete(selectedCardId!); // 👉 DBの方を削除

        // 👉 フロントでグローバルで管理しているカードを更新(削除)
        setCards((prevCards: Card[]) => {
          return prevCards.filter(card => card.id != selectedCardId);
        });

        setSelectedCardId(null); // モーダルを閉じるためにnullに
      }
      
    } catch(e) {
      console.error("カードの削除に失敗しました。", e);
    }
  }

  return (
    <div 
      className="card-modal-overlay"
      onClick={ () => setSelectedCardId(null) }
    >
      <div 
        className="card-modal" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="card-modal-header">
          <div className="card-modal-list-info">
            <button 
              className="card-modal-save-button" 
              title="変更を保存"
              onClick={ updateCard }
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
                style={{ marginRight: '6px' }}
              >
                <path d="M19 12v7H5v-7M12 3v9m4-4l-4 4-4-4" />
              </svg>
              変更を保存
            </button>
          </div>
          <div className="card-modal-header-actions">
            {/* 削除ボタン */}
            <button 
              className="card-modal-header-button" 
              title="削除"
              onClick={ deleteCard }
            >
              <svg
                viewBox="0 0 24 24"
                width="16"
                height="16"
                fill="currentColor"
              >
                <path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z" />
              </svg>
            </button>

            {/* クローズボタン */}
            <button 
              className="card-modal-close"
              onClick={ () => setSelectedCardId(null) }
            >×</button>
          </div>
        </div>

        <div className="card-modal-content">
          <div className="card-modal-main">
            <div className="card-modal-title-section">
              <input 
                type="checkbox" 
                className="card-modal-title-checkbox"
                checked={ completed } // ここにtrue / false が切り替わる
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => { 
                  // console.log(e.target.checked); 
                  setCompleted(e.target.checked);
                }}
              />
              <textarea
                placeholder="タイトルを入力"
                className="card-modal-title"
                maxLength={50}
                value={ title }
                onChange={ (e: React.ChangeEvent<HTMLInputElement>) => setTitle(e.target.value) }
              />
            </div>
            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">🕒</span>
                  期限
                </h3>
              </div>
              <input 
                type="date" 
                className="card-modal-due-date" 
                value={ dueDate }
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDueDate(e.target.value)}
              />
            </div>

            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">📝</span>
                  説明
                </h3>
              </div>
              <textarea
                placeholder="説明を入力"
                className="card-modal-description"
                maxLength={200}
                value={ description }
                onChange={(e:React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
