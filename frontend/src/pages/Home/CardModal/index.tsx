
// ✅ CardModal
// → カードをクリックした時に表示

import { useAtom, useSetAtom } from "jotai";
import { cardsAtom, selectedCardIdAtom } from "../../../modules/cards/card.state";
import { cardRepository } from "../../../modules/cards/card.repository";
import type { Card } from "../../../modules/cards/card.entity";


export const CardModal = () => {
  const [ selectedCardId, setSelectedCardId ] = useAtom(selectedCardIdAtom);
  // console.log(selectedCardId);
  const setCards = useSetAtom(cardsAtom); // 更新用の関数

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
            <button className="card-modal-save-button" title="変更を保存">
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
            <button 
              className="card-modal-close"
              onClick={ () => setSelectedCardId(null) }
            >×</button>
          </div>
        </div>

        <div className="card-modal-content">
          <div className="card-modal-main">
            <div className="card-modal-title-section">
              <input type="checkbox" className="card-modal-title-checkbox" />
              <textarea
                placeholder="タイトルを入力"
                className="card-modal-title"
                maxLength={50}
              />
            </div>
            <div className="card-modal-section">
              <div className="card-modal-section-header">
                <h3 className="card-modal-section-title">
                  <span className="card-modal-section-icon">🕒</span>
                  期限
                </h3>
              </div>
              <input type="date" className="card-modal-due-date" />
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
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
