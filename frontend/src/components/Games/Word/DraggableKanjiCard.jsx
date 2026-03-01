import React from 'react';
import './WordQuizGame.css';

const DraggableKanjiCard = ({ char, isUsed, onDragStart, onDragEnd, onClick }) => {
  const handleDragStart = (e) => {
    e.dataTransfer.setData('char', char);
    e.dataTransfer.effectAllowed = 'move';
    if (onDragStart) onDragStart(char);
  };

  const handleDragEnd = (e) => {
    if (onDragEnd) onDragEnd();
  };

  // タッチイベント用の状態
  const handleTouchStart = (e) => {
    if (isUsed) return;
    const touch = e.touches[0];
    const element = e.currentTarget;

    // タッチ開始位置を記録
    element.dataset.startX = touch.clientX;
    element.dataset.startY = touch.clientY;
    element.dataset.char = char;

    // ドラッグ中のスタイルを適用
    element.classList.add('dragging');

    if (onDragStart) onDragStart(char);
  };

  const handleClick = () => {
    if (!isUsed && onClick) {
      onClick(char);
    }
  };

  return (
    <div
      className={`draggable-kanji-card ${isUsed ? 'used' : ''}`}
      draggable={!isUsed}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      onTouchStart={handleTouchStart}
      onClick={handleClick}
    >
      <div className="kanji-card-content">
        {char}
      </div>
    </div>
  );
};

export default DraggableKanjiCard;
