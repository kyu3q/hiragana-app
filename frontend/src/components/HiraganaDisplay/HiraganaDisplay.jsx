import React, { useState, useEffect } from 'react';
import './HiraganaDisplay.css';
import CharacterItem from '../CharacterItem';
import AnimationOverlay from '../AnimationOverlay';
import ScoreBoard from '../ScoreBoard';
import { hiraganaGroups } from '../../data/hiraganaData';
import { playSound, playCorrectSound, playCheerSound, playStarSound, playWrongSound } from '../../utils/soundPlayer';
import { triggerConfetti, triggerColorfulConfetti, triggerFireworks } from '../../utils/confettiEffect';
import WritingGrid from '../WritingGrid/WritingGrid';

const HiraganaDisplay = () => {
  const [selectedChar, setSelectedChar] = useState(null);
  const [score, setScore] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  const [currentGroup, setCurrentGroup] = useState(0);
  const [gameMode, setGameMode] = useState('learn'); // 'learn' または 'quiz'
  const [targetChar, setTargetChar] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);
  const [attempts, setAttempts] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false); // 状態遷移中かどうか
  const [showWritingGrid, setShowWritingGrid] = useState(false);
  const [selectedCharacter, setSelectedCharacter] = useState(null);

  // ゲームモードを切り替える
  const toggleGameMode = () => {
    // 状態遷移中なら何もしない
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // 現在の音声をすべて停止
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    
    const newMode = gameMode === 'learn' ? 'quiz' : 'learn';
    setGameMode(newMode);
    
    if (newMode === 'quiz') {
      // クイズモードに切り替えたら、ターゲット文字をランダムに選択
      // 少し遅延させて選択（UIの更新後）
      setTimeout(() => {
        selectRandomTarget(true);
        setIsTransitioning(false);
      }, 300);
    } else {
      // 学習モードに戻ったらターゲット文字をリセット
      setTargetChar(null);
      setIsCorrect(null);
      setIsTransitioning(false);
    }
  };

  // 音声再生関数をラップして状態を管理
  const playSoundWithState = (character, forcePlay = false) => {
    // 状態遷移中なら何もしない（ただし、強制再生フラグがある場合は再生）
    if (isTransitioning && !forcePlay) {
      console.log('状態遷移中のため、音声再生をスキップします');
      return;
    }
    
    // 再生中なら何もしない（ただし、強制再生フラグがある場合は再生）
    if (isPlaying && !forcePlay) {
      console.log('別の音声が再生中のため、再生をスキップします');
      return;
    }
    
    // 現在の音声をすべて停止
    window.speechSynthesis.cancel();
    
    // 再生中フラグを設定
    setIsPlaying(true);
    console.log('音声再生開始:', character);
    
    // Web Speech APIを使用して音声合成
    const utterance = new SpeechSynthesisUtterance(character);
    utterance.lang = 'ja-JP';
    utterance.volume = 1.0;
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    
    // 再生終了時のコールバック
    utterance.onend = () => {
      console.log('音声再生終了:', character);
      setIsPlaying(false);
    };
    
    // エラー時のコールバック
    utterance.onerror = (event) => {
      console.error('音声再生エラー:', event);
      setIsPlaying(false);
    };
    
    // 音声合成を実行
    window.speechSynthesis.speak(utterance);
    
    // 万が一コールバックが呼ばれない場合のフォールバック
    setTimeout(() => {
      if (isPlaying) {
        console.log('タイムアウトによる再生状態リセット');
        setIsPlaying(false);
      }
    }, 5000);
  };

  // ランダムなターゲット文字を選択
  const selectRandomTarget = (playAudio = true) => {
    // 状態遷移中なら何もしない
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // 現在の音声をすべて停止
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    
    // 現在のターゲットと異なる文字を選択するようにする
    const currentChars = hiraganaGroups[currentGroup].characters;
    let randomIndex;
    let newTarget;
    
    // 現在のターゲットと異なる文字を選択する
    do {
      randomIndex = Math.floor(Math.random() * currentChars.length);
      newTarget = currentChars[randomIndex];
    } while (targetChar && newTarget.char === targetChar.char && currentChars.length > 1);
    
    console.log('新しいターゲット選択:', newTarget.char);
    setTargetChar(newTarget);
    
    // 音声再生フラグがtrueの場合のみ音声を再生
    if (playAudio) {
      // 少し遅延させて音声を再生（UIの更新後）
      setTimeout(() => {
        console.log('新しいターゲット音声再生:', newTarget.char);
        playSoundWithState(newTarget.char);
        setIsTransitioning(false);
      }, 500);
    } else {
      setIsTransitioning(false);
    }
    
    // 正誤状態をリセット
    setIsCorrect(null);
  };

  // 文字がクリックされたときの処理
  const handleCharacterClick = (char) => {
    if (gameMode === 'learn') {
      setSelectedCharacter(char);
      setShowWritingGrid(true);
    } else if (gameMode === 'quiz') {
      // クイズモード: 選択した文字が正解かどうかを判定
      // デバッグ用のログ
      console.log('選択した文字:', char.char, typeof char.char);
      console.log('ターゲット文字:', targetChar.char, typeof targetChar.char);
      
      // 文字コードも表示
      console.log('選択した文字のコード:', char.char.charCodeAt(0));
      console.log('ターゲット文字のコード:', targetChar.char.charCodeAt(0));
      
      // 単純に文字列を比較
      const correct = char.char === targetChar.char;
      console.log('正解判定:', correct);
      
      setIsCorrect(correct);
      setAttempts(attempts + 1);
      
      if (correct) {
        // 正解の場合
        setIsTransitioning(true);
        playCorrectSound();
        triggerConfetti();
        
        // スコアを増やす
        const newScore = score + 3; // クイズモードは高得点
        setScore(newScore);
        
        // アニメーションを表示
        setShowAnimation(true);
        
        // 次の問題への遷移は closeAnimation で行う
        // ここでは次の問題を選択しない
        setTimeout(() => {
          setIsTransitioning(false);
        }, 2000);
      } else {
        // 不正解の場合
        playWrongSound();
        
        // 3回間違えたら正解を表示
        if (attempts >= 2) {
          setIsTransitioning(true);
          setSelectedChar(targetChar);
          setShowAnimation(true);
          
          // 少し遅延して次の問題へ
          setTimeout(() => {
            // アニメーションを閉じる
            setShowAnimation(false);
            
            // 次の問題を選択（音声再生あり）
            setTimeout(() => {
              selectRandomTarget(true);
              setAttempts(0);
            }, 500);
          }, 2000);
        } else {
          setTimeout(() => {
            setIsTransitioning(false);
          }, 500);
        }
      }
    }
  };

  const handleCloseWritingGrid = () => {
    setShowWritingGrid(false);
    setSelectedCharacter(null);
  };

  // アニメーションを閉じる
  const closeAnimation = () => {
    // 状態遷移中なら何もしない
    if (isTransitioning) return;
    
    setShowAnimation(false);
    
    // クイズモードで正解だった場合、次の問題へ
    if (gameMode === 'quiz' && isCorrect) {
      setIsTransitioning(true);
      // 少し遅延して次の問題を選択（音声再生あり）
      setTimeout(() => {
        selectRandomTarget(true);
        setAttempts(0);
      }, 500);
    }
  };

  // 行を切り替える
  const changeGroup = (index) => {
    // 状態遷移中なら何もしない
    if (isTransitioning) return;
    setIsTransitioning(true);
    
    // 現在の音声をすべて停止
    window.speechSynthesis.cancel();
    setIsPlaying(false);
    
    // 先に現在のグループを設定
    setCurrentGroup(index);
    
    // クイズモードの場合、新しい行からターゲットを選択
    if (gameMode === 'quiz') {
      // 少し遅延させて選択（UIの更新後）
      setTimeout(() => {
        // 新しいグループから文字を選択
        const newGroupChars = hiraganaGroups[index].characters;
        const randomIndex = Math.floor(Math.random() * newGroupChars.length);
        const newTarget = newGroupChars[randomIndex];
        
        console.log('新しいグループからターゲット選択:', newTarget.char);
        setTargetChar(newTarget);
        
        // 音声を再生
        setTimeout(() => {
          console.log('新しいグループのターゲット音声再生:', newTarget.char);
          playSoundWithState(newTarget.char);
          setIsTransitioning(false);
        }, 500);
        
        // 正誤状態をリセット
        setIsCorrect(null);
        setAttempts(0);
      }, 300);
    } else {
      setIsTransitioning(false);
    }
  };

  // 「もう一度聞く」ボタンの処理
  const handlePlayAgain = () => {
    // 状態遷移中なら何もしない
    if (isTransitioning) return;
    
    if (targetChar) {
      // 現在の音声をすべて停止してから再生
      window.speechSynthesis.cancel();
      console.log('もう一度聞く:', targetChar.char);
      playSoundWithState(targetChar.char);
    }
  };

  // コンポーネントがマウントされたときに初期化
  useEffect(() => {
    if (gameMode === 'quiz' && !targetChar) {
      selectRandomTarget(true);
    }
    
    // コンポーネントがアンマウントされるときに音声を停止
    return () => {
      window.speechSynthesis.cancel();
    };
  }, [gameMode]);

  // 5文字ごとに配列を分割する関数
  function chunkArray(array, size) {
    const result = [];
    for (let i = 0; i < array.length; i += size) {
      result.push(array.slice(i, i + size));
    }
    return result;
  }

  // 2行に分割
  const half = Math.ceil(hiraganaGroups.length / 2);
  const groupRows = [
    hiraganaGroups.slice(0, half),
    hiraganaGroups.slice(half)
  ];

  return (
    <div className="hiragana-display">
      <div className="header-row">
        <h1 className="title stylish-title">ひらがなであそぼう！</h1>
        <div className="mode-toggle-inline">
          <button 
            className={`mode-button ${gameMode === 'learn' ? 'active' : ''}`}
            onClick={toggleGameMode}
            disabled={isTransitioning}
          >
            {gameMode === 'learn' ? '学習モード' : 'クイズモード'}
          </button>
        </div>
      </div>

      <div className="shinkansen-wrapper">
        <div className="group-rail-rows">
          {groupRows.map((row, rowIdx) => (
            <div className="group-tabs-rail" key={rowIdx}>
              <button
                className={`group-rail-btn shinkansen-head ${rowIdx === 0 ? 'hayabusa-head' : 'komachi-head'}`}
                disabled
                aria-hidden="true"
              />
              {row.map((group, index) => (
                <React.Fragment key={group.name}>
                  <button
                    className={`group-rail-btn ${currentGroup === hiraganaGroups.indexOf(group) ? 'active' : ''}`}
                    onClick={() => changeGroup(hiraganaGroups.indexOf(group))}
                    disabled={isTransitioning}
                  >
                    {group.name}
                  </button>
                  {index < row.length - 1 && <span className="rail-connector" />}
                </React.Fragment>
              ))}
              <div className="rail-track" />
            </div>
          ))}
        </div>
      </div>

      <div className="characters-area">
        <div className="characters-grid">
          {chunkArray(hiraganaGroups[currentGroup].characters, 5).map((row, rowIndex) => (
            <div className="characters-row" key={rowIndex}>
              {row.map((char, index) => (
                <CharacterItem
                  key={index}
                  character={char}
                  onClick={handleCharacterClick}
                  isTarget={gameMode === 'quiz' && targetChar && char.char === targetChar.char && isCorrect !== null}
                  isCorrect={isCorrect}
                />
              ))}
            </div>
          ))}
        </div>
      </div>

      {showAnimation && selectedChar && (
        <AnimationOverlay 
          character={selectedChar}
          onClose={closeAnimation}
          isCorrect={isCorrect}
          gameMode={gameMode}
        />
      )}

      {showWritingGrid && selectedCharacter && (
        <WritingGrid
          character={selectedCharacter}
          onClose={handleCloseWritingGrid}
        />
      )}
    </div>
  );
};

export default HiraganaDisplay; 