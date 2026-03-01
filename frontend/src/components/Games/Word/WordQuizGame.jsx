import React, { useState, useEffect, useRef } from 'react';
import './WordQuizGame.css';
import DraggableKanjiCard from './DraggableKanjiCard';
import DropZone from './DropZone';
import { grade2WordData, gameConfig, generateDummyChars, shuffle } from '../../../data/wordData';
import { kanjiByGrade } from '../../../data/kanjiData';
import { playMemoryOKSound, playWrongSound } from '../../../utils/soundPlayer';

const WordQuizGame = ({ selectedKanji, onClose }) => {
  const [currentWord, setCurrentWord] = useState(null);
  const [choices, setChoices] = useState([]);
  const [dropZones, setDropZones] = useState([]);
  const [usedChars, setUsedChars] = useState(new Set());
  const [score, setScore] = useState(0);
  const [questionsAnswered, setQuestionsAnswered] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct' | 'incorrect' | null
  const [isComplete, setIsComplete] = useState(false);
  const [answeredWords, setAnsweredWords] = useState([]);
  const [usedWordIndices, setUsedWordIndices] = useState(new Set());
  const isChecking = useRef(false);

  // 2年生の漢字リストを取得
  const grade2Kanji = kanjiByGrade.find(g => g.grade === 2)?.items.map(item => item.char) || [];

  // 問題を生成
  const generateQuestion = () => {
    const availableWords = grade2WordData[selectedKanji];
    if (!availableWords || availableWords.length === 0) {
      return null;
    }

    // まだ使っていない単語を選ぶ
    let targetWordIndex = -1;
    if (usedWordIndices.size < availableWords.length) {
      // まだ使っていない単語がある場合
      const unusedIndices = availableWords
        .map((_, index) => index)
        .filter(index => !usedWordIndices.has(index));
      targetWordIndex = unusedIndices[Math.floor(Math.random() * unusedIndices.length)];
    } else {
      // 全部使った場合はランダムに選ぶ（重複OK）
      targetWordIndex = Math.floor(Math.random() * availableWords.length);
    }

    const targetWord = availableWords[targetWordIndex];
    setUsedWordIndices(new Set([...usedWordIndices, targetWordIndex]));

    // 選択肢を生成
    const correctChars = targetWord.chars.filter(c => c !== selectedKanji);
    const dummyCount = gameConfig.maxChoices - correctChars.length;
    const dummyChars = generateDummyChars(correctChars, dummyCount, grade2Kanji);
    const allChoices = shuffle([...correctChars, ...dummyChars]);

    // ドロップゾーンを初期化
    const initialDropZones = targetWord.chars.map((char, index) => ({
      index,
      char: char === selectedKanji ? selectedKanji : null,
      locked: char === selectedKanji
    }));

    // 選択した漢字の位置を記録
    const usedSet = new Set();
    if (targetWord.chars.includes(selectedKanji)) {
      usedSet.add(selectedKanji);
    }

    setCurrentWord(targetWord);
    setChoices(allChoices);
    setDropZones(initialDropZones);
    setUsedChars(usedSet);
    setFeedback(null);
  };

  // 初期化
  useEffect(() => {
    const availableWords = grade2WordData[selectedKanji];
    if (!availableWords || availableWords.length === 0) {
      // 単語データがない場合
      alert(`「${selectedKanji}」の単語クイズはまだないよ！`);
      onClose();
    } else {
      generateQuestion();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ドロップハンドラー
  const handleDrop = (dropIndex, droppedChar) => {
    if (isChecking.current || feedback) return;

    // 既に使用されている文字はスキップ
    if (usedChars.has(droppedChar)) return;

    // ドロップゾーンを更新
    const newDropZones = [...dropZones];
    newDropZones[dropIndex] = {
      ...newDropZones[dropIndex],
      char: droppedChar
    };

    setDropZones(newDropZones);
    setUsedChars(new Set([...usedChars, droppedChar]));

    // すべてのドロップゾーンが埋まったか確認
    const allFilled = newDropZones.every(zone => zone.char !== null);
    if (allFilled) {
      // 自動判定
      setTimeout(() => checkAnswer(newDropZones), 300);
    }
  };

  // 削除ハンドラー
  const handleRemove = (dropIndex) => {
    if (isChecking.current || feedback) return;

    const removedChar = dropZones[dropIndex].char;
    if (!removedChar || dropZones[dropIndex].locked) return;

    // ドロップゾーンをクリア
    const newDropZones = [...dropZones];
    newDropZones[dropIndex] = {
      ...newDropZones[dropIndex],
      char: null
    };

    // 使用済みセットから削除
    const newUsedChars = new Set(usedChars);
    newUsedChars.delete(removedChar);

    setDropZones(newDropZones);
    setUsedChars(newUsedChars);
  };

  // 回答チェック
  const checkAnswer = (zones) => {
    if (isChecking.current) return;
    isChecking.current = true;

    const userAnswer = zones.map(zone => zone.char).join('');
    const correctAnswer = currentWord.word;

    if (userAnswer === correctAnswer) {
      // 正解
      playMemoryOKSound();
      setFeedback('correct');
      setScore(score + gameConfig.pointsPerCorrect);
      setAnsweredWords([...answeredWords, currentWord]);

      setTimeout(() => {
        const nextQuestionNum = questionsAnswered + 1;
        if (nextQuestionNum >= gameConfig.questionsPerGame) {
          // ゲーム終了
          setIsComplete(true);
        } else {
          // 次の問題
          setQuestionsAnswered(nextQuestionNum);
          generateQuestion();
        }
        isChecking.current = false;
      }, 2000);
    } else {
      // 不正解
      playWrongSound();
      setFeedback('incorrect');

      setTimeout(() => {
        setFeedback(null);
        isChecking.current = false;
      }, 1500);
    }
  };

  // 完了画面
  if (isComplete) {
    return (
      <div className="word-quiz-container">
        <div className="word-quiz-content">
          <div className="quiz-complete">
            <h2>🎉 よくできました！ 🎉</h2>
            <div className="final-score">
              <p>スコア: {score}点</p>
              <p>正解数: {questionsAnswered}/{gameConfig.questionsPerGame}</p>
            </div>
            <div className="answered-words">
              <h3>おぼえた単語</h3>
              {answeredWords.map((word, index) => (
                <div key={index} className="word-item">
                  <span className="word-kanji">{word.word}</span>
                  <span className="word-reading">（{word.reading}）</span>
                </div>
              ))}
            </div>
            <button className="primary" onClick={onClose}>
              とじる
            </button>
          </div>
        </div>
      </div>
    );
  }

  // データがない場合
  if (!currentWord) {
    return null;
  }

  return (
    <div className="word-quiz-container">
      <div className="word-quiz-content">
        <div className="quiz-header">
          <div className="quiz-info">
            <h2>単語クイズ</h2>
            <div className="quiz-stats">
              <span>問題: {questionsAnswered + 1}/{gameConfig.questionsPerGame}</span>
              <span>スコア: {score}</span>
            </div>
          </div>
          <button className="ghost" onClick={onClose}>✕</button>
        </div>

        <div className="quiz-body">
          <div className="drop-zones-container">
            {dropZones.map((zone) => (
              <DropZone
                key={zone.index}
                index={zone.index}
                char={zone.char}
                locked={zone.locked}
                onDrop={handleDrop}
                onRemove={handleRemove}
                isCorrect={feedback === 'correct' ? true : feedback === 'incorrect' ? false : null}
              />
            ))}
          </div>

          {feedback && (
            <div className={`feedback-message ${feedback}`}>
              {feedback === 'correct' ? (
                <>
                  <div className="feedback-icon">🎉</div>
                  <div className="feedback-text">せいかい！</div>
                  <div className="correct-word">
                    <div className="word-display">{currentWord.word}</div>
                    <div className="word-reading">（{currentWord.reading}）</div>
                  </div>
                </>
              ) : (
                <>
                  <div className="feedback-icon">😢</div>
                  <div className="feedback-text">ちがうよ…もう一回！</div>
                </>
              )}
            </div>
          )}

          <div className="choices-container">
            {choices.map((char, index) => (
              <DraggableKanjiCard
                key={`${char}-${index}`}
                char={char}
                isUsed={usedChars.has(char)}
                onDragStart={() => {}}
                onDragEnd={() => {}}
                onClick={() => {
                  if (!usedChars.has(char) && !isChecking.current && !feedback) {
                    // 最初の空いているドロップゾーンを見つける
                    const emptyZoneIndex = dropZones.findIndex(zone => !zone.locked && zone.char === null);
                    if (emptyZoneIndex !== -1) {
                      handleDrop(emptyZoneIndex, char);
                    }
                  }
                }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default WordQuizGame;
