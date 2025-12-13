import React, { useState, useEffect } from 'react';
import './ShiritoriGame.css';
import { shiritoriData as hiraganaData } from '../../../data/shiritoriHiragana';
import { shiritoriData as katakanaData } from '../../../data/shiritoriKatakana';
import { playHappy1Sound, playOK1Sound } from '../../../utils/soundPlayer';

const ShiritoriGame = ({ onClose, type }) => {
  const [currentWord, setCurrentWord] = useState('');
  const [choices, setChoices] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState('parent'); // 'parent' or 'child'
  const [turn, setTurn] = useState(1);
  const [history, setHistory] = useState([]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isResult, setIsResult] = useState(false); // 勝者発表画面
  const [startTime, setStartTime] = useState(null);
  const [times, setTimes] = useState({ parent: [], child: [] });
  const [elapsed, setElapsed] = useState(0); // 経過時間
  const [winner, setWinner] = useState('');
  const [wrongWord, setWrongWord] = useState(''); // 間違った単語を保存

  // typeに応じてデータを切り替え
  const shiritoriData = type === 'katakana' ? katakanaData : hiraganaData;

  // ひらがな用
  const yoonMapHiragana = {
    'しゃ': 'や', 'しゅ': 'ゆ', 'しょ': 'よ',
    'じゃ': 'や', 'じゅ': 'ゆ', 'じょ': 'よ',
    'ちゃ': 'や', 'ちゅ': 'ゆ', 'ちょ': 'よ',
    'きゃ': 'や', 'きゅ': 'ゆ', 'きょ': 'よ',
    'ぎゃ': 'や', 'ぎゅ': 'ゆ', 'ぎょ': 'よ',
    'にゃ': 'や', 'にゅ': 'ゆ', 'にょ': 'よ',
    'ひゃ': 'や', 'ひゅ': 'ゆ', 'ひょ': 'よ',
    'びゃ': 'や', 'びゅ': 'ゆ', 'びょ': 'よ',
    'ぴゃ': 'や', 'ぴゅ': 'ゆ', 'ぴょ': 'よ',
    'みゃ': 'や', 'みゅ': 'ゆ', 'みょ': 'よ',
    'りゃ': 'や', 'りゅ': 'ゆ', 'りょ': 'よ',
    'ゃ': 'や', 'ゅ': 'ゆ', 'ょ': 'よ',
  };
  const yoonInitialsHiragana = {
    'り': ['りゃ', 'りゅ', 'りょ'],
    'し': ['しゃ', 'しゅ', 'しょ'],
    'ち': ['ちゃ', 'ちゅ', 'ちょ'],
    'き': ['きゃ', 'きゅ', 'きょ'],
    'ぎ': ['ぎゃ', 'ぎゅ', 'ぎょ'],
    'じ': ['じゃ', 'じゅ', 'じょ'],
    'に': ['にゃ', 'にゅ', 'にょ'],
    'ひ': ['ひゃ', 'ひゅ', 'ひょ'],
    'び': ['びゃ', 'びゅ', 'びょ'],
    'ぴ': ['ぴゃ', 'ぴゅ', 'ぴょ'],
    'み': ['みゃ', 'みゅ', 'みょ'],
    'ゆ': ['ゆ'], 'よ': ['よ']
  };
  // カタカナ用
  const yoonMapKatakana = {
    'シャ': 'ヤ', 'シュ': 'ユ', 'ショ': 'ヨ',
    'ジャ': 'ヤ', 'ジュ': 'ユ', 'ジョ': 'ヨ',
    'チャ': 'ヤ', 'チュ': 'ユ', 'チョ': 'ヨ',
    'キャ': 'ヤ', 'キュ': 'ユ', 'キョ': 'ヨ',
    'ギャ': 'ヤ', 'ギュ': 'ユ', 'ギョ': 'ヨ',
    'ニャ': 'ヤ', 'ニュ': 'ユ', 'ニョ': 'ヨ',
    'ヒャ': 'ヤ', 'ヒュ': 'ユ', 'ヒョ': 'ヨ',
    'ビャ': 'ヤ', 'ビュ': 'ユ', 'ビョ': 'ヨ',
    'ピャ': 'ヤ', 'ピュ': 'ユ', 'ピョ': 'ヨ',
    'ミャ': 'ヤ', 'ミュ': 'ユ', 'ミョ': 'ヨ',
    'リャ': 'ヤ', 'リュ': 'ユ', 'リョ': 'ヨ',
    'ャ': 'ヤ', 'ュ': 'ユ', 'ョ': 'ヨ',
  };
  const yoonInitialsKatakana = {
    'リ': ['リャ', 'リュ', 'リョ'],
    'シ': ['シャ', 'シュ', 'ショ'],
    'チ': ['チャ', 'チュ', 'チョ'],
    'キ': ['キャ', 'キュ', 'キョ'],
    'ギ': ['ギャ', 'ギュ', 'ギョ'],
    'ジ': ['ジャ', 'ジュ', 'ジョ'],
    'ニ': ['ニャ', 'ニュ', 'ニョ'],
    'ヒ': ['ヒャ', 'ヒュ', 'ヒョ'],
    'ビ': ['ビャ', 'ビュ', 'ビョ'],
    'ピ': ['ピャ', 'ピュ', 'ピョ'],
    'ミ': ['ミャ', 'ミュ', 'ミョ']
  };

  // typeに応じて使うyoonMap/yoonInitialsを切り替え
  const yoonMap = type === 'katakana' ? yoonMapKatakana : yoonMapHiragana;
  const yoonInitials = type === 'katakana' ? yoonInitialsKatakana : yoonInitialsHiragana;

  // ゲーム開始時の初期化
  useEffect(() => {
    initializeGame();
  }, []);

  // 経過時間の更新
  useEffect(() => {
    if (isGameOver || !startTime) return;
    const interval = setInterval(() => {
      setElapsed(((Date.now() - startTime) / 1000));
    }, 100);
    return () => clearInterval(interval);
  }, [startTime, isGameOver]);

  // 勝者発表時に拍手SE再生
  useEffect(() => {
    if (isResult && winner) {
      playHappy1Sound();
    }
  }, [isResult, winner]);

  const initializeGame = () => {
    const initialWord = getRandomWord();
    setCurrentWord(initialWord);
    generateChoices(initialWord);
    setStartTime(Date.now());
    setElapsed(0);
    setHistory([initialWord]);
    setTurn(1);
    setCurrentPlayer('parent');
    setIsGameOver(false);
    setIsResult(false);
    setWinner('');
    setTimes({ parent: [], child: [] });
    setWrongWord('');
  };

  const getRandomWord = () => {
    const shiritoriWords = shiritoriData.shiritoriWords;
    const wordsEndingWithN = Object.values(shiritoriData.wordsEndingWithN).flat();
    const allWords = Object.values(shiritoriWords).flat();
    // 「ん」「ン」で終わる単語・始まる単語を除外
    const validWords = allWords.filter(word =>
      !wordsEndingWithN.includes(word) &&
      !word.endsWith('ん') &&
      !word.endsWith('ン')
    );
    return validWords[Math.floor(Math.random() * validWords.length)];
  };

  // 仕様に沿った選択肢生成
  const generateChoices = (word) => {
    const lastChar = word.slice(-1);
    // 小さい文字を大きい文字に正規化
    const normalizedLastChar = yoonMap[lastChar] || lastChar;
    const shiritoriWords = shiritoriData.shiritoriWords;
    const wordsEndingWithN = shiritoriData.wordsEndingWithN;

    // 1. 正規化した文字から始まる単語2個
    const goWords = (shiritoriWords[normalizedLastChar] || []).slice();
    const goChoices = shuffle(goWords).slice(0, 2);

    // 2. 正規化した文字から始まり「ん」で終わる単語1個
    const goNWords = (shiritoriWords[normalizedLastChar] || []).filter(w => w.endsWith('ん'));
    const goNChoice = shuffle(goNWords).slice(0, 1);

    // 3. shiritoriWords全体からランダム7個（重複しないように）
    let allWords = Object.values(shiritoriWords).flat();
    // すでに選ばれた単語を除外
    const exclude = new Set([...goChoices, ...goNChoice]);
    allWords = allWords.filter(w => !exclude.has(w));
    const randomChoices = shuffle(allWords).slice(0, 7);

    // 合成してシャッフル
    const result = shuffle([...goChoices, ...goNChoice, ...randomChoices]);
    setChoices(result);
  };

  // シャッフル関数
  function shuffle(array) {
    const arr = array.slice();
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
  }

  const handleChoice = (choice) => {
    const endTime = Date.now();
    const timeTaken = (endTime - startTime) / 1000;
    // 時間を記録
    setTimes(prev => ({
      ...prev,
      [currentPlayer]: [...prev[currentPlayer], timeTaken]
    }));
    setElapsed(0);

    // すでに選択した単語なら即ゲーム終了
    if (history.includes(choice)) {
      setWrongWord(choice);
      setIsGameOver(true);
      setIsResult(true);
      setWinner((currentPlayer === 'parent' ? '🐶' : '🦁') + 'の勝ち！（同じ単語を繰り返した）');
      return;
    }

    // しりとり判定: 前の単語の最後の文字と選択単語の最初の文字が一致しているか、または「ん」で終わるか
    const prevWord = history[history.length - 1];
    
    // 前の単語の最後の文字を取得（拗音の場合は2文字）
    let prevLastChar = prevWord.slice(-1);
    if (prevWord.length >= 2) {
      const lastTwoChars = prevWord.slice(-2);
      if (yoonMap[lastTwoChars]) {
        prevLastChar = lastTwoChars;
      }
    }

    // 選択単語の最初の文字を取得（拗音の場合は2文字）
    let choiceFirstChar = choice.slice(0, 1);
    if (choice.length >= 2) {
      const firstTwoChars = choice.slice(0, 2);
      if (yoonMap[firstTwoChars]) {
        choiceFirstChar = firstTwoChars;
      }
    }

    // 前の単語の最後の文字が拗音の場合、対応する文字に変換
    const prevLastCharNormalized = yoonMap[prevLastChar] || prevLastChar;
    // 選択単語の最初の文字が拗音の場合、対応する文字に変換
    const choiceFirstCharNormalized = yoonMap[choiceFirstChar] || choiceFirstChar;

    // --- ここから拗音許容ロジック ---
    let isValid = false;
    if (choiceFirstCharNormalized === prevLastCharNormalized) {
      isValid = true;
    } else if (
      yoonInitials[prevLastCharNormalized] &&
      yoonInitials[prevLastCharNormalized].includes(choiceFirstChar)
    ) {
      // 例: 「り」→「りゃ」「りゅ」「りょ」
      isValid = true;
    }

    if (!isValid) {
      setWrongWord(choice);
      setIsGameOver(true);
      setIsResult(true);
      setWinner((currentPlayer === 'parent' ? '🐶' : '🦁') + 'の勝ち！（相手が正しい単語を選ばなかった）');
      return;
    }

    const choiceLastChar = choice.slice(-1);
    const endChar = type === 'katakana' ? 'ン' : 'ん';
    if (choiceLastChar === endChar) {
      // 「ん」または「ン」で終わる単語を選んだ場合
      setWrongWord(choice);
      setIsGameOver(true);
      setIsResult(true);
      setWinner((currentPlayer === 'parent' ? '🐶' : '🦁') + `の勝ち！（相手が「${endChar}」で終わる単語を選んだ）`);
      return;
    }

    // 単語を履歴に追加
    playOK1Sound();
    setHistory([...history, choice]);
    setCurrentWord(choice);
    generateChoices(choice);
    // 10ターンで勝者発表
    if (turn >= 9) {
      setTimeout(() => {
        showResult();
      }, 500);
      setIsGameOver(true);
      return;
    }
    setCurrentPlayer(currentPlayer === 'parent' ? 'child' : 'parent');
    setTurn(prev => prev + 1);
    setStartTime(Date.now());
  };

  const showResult = () => {
    const parentTotal = times.parent.reduce((a, b) => a + b, 0);
    const childTotal = times.child.reduce((a, b) => a + b, 0);
    let winnerText = '';
    if (parentTotal < childTotal) {
      winnerText = '🦁の勝ち！';
    } else if (childTotal < parentTotal) {
      winnerText = '🐶の勝ち！';
    } else {
      winnerText = '引き分け！';
    }
    setWinner(winnerText);
    setIsResult(true);
  };

  // 続けて遊ぶ（新しいしりとり）
  const handleContinue = () => {
    initializeGame();
  };

  // 勝者発表画面
  if (isResult) {
    const parentTotal = times.parent.reduce((a, b) => a + b, 0);
    const childTotal = times.child.reduce((a, b) => a + b, 0);
    return (
      <div className="shiritori-game">
        <div className="shiritori-history-area">
          {history.map((word, idx) => (
            <span key={idx} className="shiritori-history-word">
              {word}
              {idx < history.length - 1 && <span className="shiritori-history-arrow"> → </span>}
            </span>
          ))}
          {wrongWord && (
            <>
              <span className="shiritori-history-arrow"> → </span>
              <span className="shiritori-history-word wrong-word">
                {wrongWord}
              </span>
            </>
          )}
        </div>
        <div className="shiritori-result-area">
          <div className="winner-emoji" style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>
            {winner.includes('🦁') ? '🦁' : winner.includes('🐶') ? '🐶' : '🤝'}
          </div>
          <div className="winner-announcement" style={{
            color: winner.includes('🦁') ? '#ff9800' : winner.includes('🐶') ? '#2196f3' : '#888',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            letterSpacing: '0.1em',
            textShadow: '0 2px 8px #fff3'
          }}>
            🎉{winner}
          </div>
          <div className="result-times">
            <div className="result-time-row">
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🦁</span>
              <span style={{ fontWeight: 'bold', color: '#ff9800' }}>{parentTotal.toFixed(1)}秒</span>
            </div>
            <div className="result-time-row">
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🐶</span>
              <span style={{ fontWeight: 'bold', color: '#2196f3' }}>{childTotal.toFixed(1)}秒</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // メインゲーム画面
  return (
    <div className="shiritori-game">
      <div className="shiritori-history-area">
        {history.map((word, idx) => (
          <span key={idx} className="shiritori-history-word">
            {word}
            {idx < history.length - 1 && <span className="shiritori-history-arrow"> → </span>}
          </span>
        ))}
      </div>
      <div className="shiritori-players-area">
        <div className={`shiritori-player-area parent${currentPlayer === 'parent' ? ' active' : ''}`}> 
          <div className="shiritori-player-title">
            <span
              className={`player-icon${currentPlayer === 'parent' ? ' active' : ''}`}
              role="img"
              aria-label="親"
              style={{ fontSize: currentPlayer === 'parent' ? '2.8rem' : '2rem', transition: 'font-size 0.2s', marginRight: '0.5rem' }}
            >🦁</span>
            <span style={{ marginLeft: '1rem', fontSize: '1.2rem', color: '#ff9800', fontWeight: 'bold' }}>
              {(times.parent.reduce((a, b) => a + b, 0) + (currentPlayer === 'parent' ? elapsed : 0)).toFixed(1)}秒
            </span>
          </div>
          {currentPlayer === 'parent' && (
            <div className="shiritori-player-words">
              {choices.map((choice, idx) => (
                <button key={idx} onClick={() => handleChoice(choice)} className="choice-button">{choice}</button>
              ))}
            </div>
          )}
        </div>
        <div className={`shiritori-player-area child${currentPlayer === 'child' ? ' active' : ''}`}> 
          <div className="shiritori-player-title">
            <span
              className={`player-icon${currentPlayer === 'child' ? ' active' : ''}`}
              role="img"
              aria-label="子ども"
              style={{ fontSize: currentPlayer === 'child' ? '2.8rem' : '2rem', transition: 'font-size 0.2s', marginRight: '0.5rem' }}
            >🐶</span>
            <span style={{ marginLeft: '1rem', fontSize: '1.2rem', color: '#2196f3', fontWeight: 'bold' }}>
              {(times.child.reduce((a, b) => a + b, 0) + (currentPlayer === 'child' ? elapsed : 0)).toFixed(1)}秒
            </span>
          </div>
          {currentPlayer === 'child' && (
            <div className="shiritori-player-words">
              {choices.map((choice, idx) => (
                <button key={idx} onClick={() => handleChoice(choice)} className="choice-button">{choice}</button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShiritoriGame;
