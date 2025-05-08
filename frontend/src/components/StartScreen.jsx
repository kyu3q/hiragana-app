import React from 'react';
import './StartScreen.css';

const StartScreen = ({ onSelect }) => {
  return (
    <div className="start-screen">
      <h1 className="start-title">どれであそぶ？</h1>
      <div className="start-buttons">
        <button className="start-btn hiragana" onClick={() => onSelect('hiragana')}>
          ひらがな
        </button>
        <button className="start-btn katakana" onClick={() => onSelect('katakana')}>
          カタカナ
        </button>
        <button className="start-btn kanji" onClick={() => onSelect('kanji')}>
          漢字
        </button>
      </div>
    </div>
  );
};

export default StartScreen; 