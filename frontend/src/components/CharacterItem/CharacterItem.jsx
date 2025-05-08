import React from 'react';
import './CharacterItem.css';
import { characterEmojis } from '../../data/hiraganaData';

const CharacterItem = ({ character, onClick, isTarget, isCorrect }) => {
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
      className={`character-item ${getStatusClass()}`}
      onClick={handleClick}
    >
      <div className="character-main">{character.char}</div>
      <div className="character-emoji">{randomEmoji}</div>
    </div>
  );
};

export default CharacterItem; 