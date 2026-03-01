import React from 'react';
import './WordQuizGame.css';

const DropZone = ({ index, char, locked, onDrop, onRemove, isCorrect }) => {
  const handleDragOver = (e) => {
    if (locked) return;
    e.preventDefault();
    e.currentTarget.classList.add('drag-over');
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove('drag-over');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.currentTarget.classList.remove('drag-over');

    if (locked) return;

    const droppedChar = e.dataTransfer.getData('char');
    if (droppedChar && onDrop) {
      onDrop(index, droppedChar);
    }
  };

  const handleClick = () => {
    // 配置済みの文字をクリックして削除（ロックされていない場合）
    if (char && !locked && onRemove) {
      onRemove(index);
    }
  };

  // タッチイベント用
  const handleTouchEnd = (e) => {
    if (locked) return;

    // タッチ終了位置を取得
    const touch = e.changedTouches[0];
    const element = document.elementFromPoint(touch.clientX, touch.clientY);

    // ドロップゾーンの要素を見つける
    const dropZone = element?.closest('.drop-zone');
    if (dropZone && dropZone === e.currentTarget) {
      // ドラッグ中の文字を取得
      const draggedElements = document.querySelectorAll('.dragging');
      if (draggedElements.length > 0) {
        const draggedElement = draggedElements[0];
        const droppedChar = draggedElement.dataset.char;
        if (droppedChar && onDrop) {
          onDrop(index, droppedChar);
        }
        draggedElement.classList.remove('dragging');
      }
    }
  };

  return (
    <div
      className={`drop-zone ${char ? 'filled' : 'empty'} ${locked ? 'locked' : ''} ${isCorrect === true ? 'correct' : ''} ${isCorrect === false ? 'incorrect' : ''}`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onTouchEnd={handleTouchEnd}
      onClick={handleClick}
    >
      {char ? (
        <div className="drop-zone-content">
          {char}
          {!locked && <span className="remove-hint">✕</span>}
        </div>
      ) : (
        <div className="drop-zone-placeholder">？</div>
      )}
    </div>
  );
};

export default DropZone;
