import React, { useEffect, useState } from 'react';
import './AnimationOverlay.css';
import { characterEmojis, praises } from '../../data/hiraganaData';

const AnimationOverlay = ({ character, onClose, isCorrect, gameMode }) => {
  // ランダムな絵文字と褒め言葉を選択
  const randomEmoji = characterEmojis[Math.floor(Math.random() * characterEmojis.length)];
  const randomPraise = praises[Math.floor(Math.random() * praises.length)];
  
  // 音声再生状態を管理
  const [hasSoundPlayed, setHasSoundPlayed] = useState(false);
  
  // コンポーネントがマウントされたときに一度だけ実行
  useEffect(() => {
    // 学習モードの場合のみ音声を再生
    if (gameMode === 'learn' && !hasSoundPlayed) {
      // 音声再生フラグを設定
      setHasSoundPlayed(true);
      
      // 少し遅延させて音声を再生
      setTimeout(() => {
        // 現在再生中の音声をすべて停止
        if (window.speechSynthesis) {
          window.speechSynthesis.cancel();
        }
        
        console.log('学習モードで音声再生:', character.char);
        
        // 新しい音声を作成
        const utterance = new SpeechSynthesisUtterance(character.char);
        utterance.lang = 'ja-JP';
        utterance.volume = 1.0;
        utterance.rate = 0.8;
        utterance.pitch = 1.2;
        
        // 音声合成を実行
        window.speechSynthesis.speak(utterance);
      }, 500);
    }
    
    // 自動的に閉じるタイマー
    const timer = setTimeout(() => {
      onClose();
    }, 3000);
    
    return () => {
      clearTimeout(timer);
      // コンポーネントがアンマウントされるときに音声を停止
      if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
    };
  }, [character, onClose, gameMode, hasSoundPlayed]);

  // クイズモードでの正解/不正解メッセージ
  const getResultMessage = () => {
    if (gameMode !== 'quiz') return null;
    
    if (isCorrect) {
      return <div className="result-message correct">正解！</div>;
    } else {
      return <div className="result-message wrong">正解は「{character.char}」でした</div>;
    }
  };
  
  // 音声を再生するボタン（デバッグ用）
  const playCharacterSound = () => {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    
    console.log('ボタンクリックで音声再生:', character.char);
    
    const utterance = new SpeechSynthesisUtterance(character.char);
    utterance.lang = 'ja-JP';
    utterance.volume = 1.0;
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    window.speechSynthesis.speak(utterance);
  };
  
  return (
    <div className="animation-overlay" onClick={onClose}>
      <div className="animation-content">
        <div className="large-character">{character.char}</div>
        <div className="character-info">
          <div className="character-reading">{character.romaji}</div>
          <div className="character-example">{character.image}</div>
        </div>
        {getResultMessage()}
        
        {/* デバッグ用の音声再生ボタン */}
        {gameMode === 'learn' && (
          <button 
            onClick={(e) => {
              e.stopPropagation(); // オーバーレイのクリックイベントを停止
              playCharacterSound();
            }}
            className="sound-button"
          >
            🔊 音声を再生
          </button>
        )}
      </div>
    </div>
  );
};

export default AnimationOverlay; 