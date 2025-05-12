import React from 'react';
import './CharacterItem.css';
import { characterEmojis } from '../../data/hiraganaData';

const CharacterItem = ({ character, onClick, isTarget, isCorrect, className }) => {
  // ランダムな絵文字を選択
  const randomEmoji = characterEmojis[Math.floor(Math.random() * characterEmojis.length)];
  
  const handleClick = () => {
    onClick(character);
  };

  // クイズモードでの正解/不正解の状態に応じたクラスを追加
  const getStatusClass = () => {
    if (isTarget && isCorrect === true) return 'correct';
    if (isTarget && isCorrect === false) return 'wrong';
    if (isTarget) return 'is-target';
    return '';
  };

  return (
    <div 
      className={`character-item${className ? ` ${className}` : ''} ${getStatusClass()}`}
      onClick={handleClick}
    >
      <div className="character-main">{character.char}</div>
      <div className="character-emoji">{randomEmoji}</div>
      <svg className="card-leaf" width="32" height="32" viewBox="0 0 32 32"><ellipse cx="16" cy="24" rx="10" ry="6" fill="#4caf50" /><path d="M16 24 Q18 18 24 12" stroke="#388e3c" strokeWidth="2" fill="none"/></svg>
    </div>
  );
};

export default CharacterItem; 