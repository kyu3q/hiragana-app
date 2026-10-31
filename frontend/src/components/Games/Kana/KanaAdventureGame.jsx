import React, { useState, useEffect, useRef } from 'react';
import './KanaAdventureGame.css';
import { hiraganaGroups } from '../../../data/hiraganaData';
import { katakanaGroups } from '../../../data/katakanaData';
import { playOK1Sound, playWrongSound, playHappy1Sound } from '../../../utils/soundPlayer';
import { triggerConfetti } from '../../../utils/confettiEffect';
import { speak, isSpeechAvailable, warmUpVoices, onVoicesChanged } from '../../../utils/speech';
import { getDifficulty } from './adventureConfig';
import {
  generateQuestions,
  buildQuestion,
  insertRetry,
  resolveType,
  countScoredQuestions,
} from './questionGenerator';
import DifficultySelect from './DifficultySelect';
import AdventureScene from './AdventureScene';
import { buildPathD } from './pathGeometry';

const NODE_HEIGHT = 140;
const PATH_PADDING_TOP = 100;
const PATH_PADDING_BOTTOM = 150;
const FEEDBACK_MS = 1000;

const KanaAdventureGame = ({ onClose, type }) => {
  const [screen, setScreen] = useState('select'); // 'select', 'playing', 'result', 'failed'
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [weakIds, setWeakIds] = useState([]); // セッション内で間違えた文字
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
  const [selectedOption, setSelectedOption] = useState(null);
  const [speechAvailable, setSpeechAvailable] = useState(false);

  const activeStageRef = useRef(null);
  const timerRef = useRef(null);

  const dataGroups = type === 'katakana' ? katakanaGroups : hiraganaGroups;
  const allChars = dataGroups.flatMap((g) => g.characters);

  // 音声一覧の読み込みを先に始め、タイマーは破棄時に止める
  useEffect(() => {
    warmUpVoices();
    const unsubscribe = onVoicesChanged(() => setSpeechAvailable(isSpeechAvailable()));
    return () => {
      unsubscribe();
      clearTimeout(timerRef.current);
    };
  }, []);

  // ひらがな/カタカナが切り替わったら難易度選択に戻る
  useEffect(() => {
    clearTimeout(timerRef.current);
    setScreen('select');
  }, [type]);

  const currentQuestion = questions[currentIndex];
  const targetChar = currentQuestion?.target.char;
  const currentType = currentQuestion ? resolveType(currentQuestion.type, speechAvailable) : null;

  // 現在のステージへ自動スクロール
  useEffect(() => {
    if (activeStageRef.current) {
      activeStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex, screen]);

  // 音声出題は、問題が表示されたら自動で読み上げる
  useEffect(() => {
    if (screen === 'playing' && currentType === 'sound-to-char') {
      speak(targetChar, () => setSpeechAvailable(false));
    }
  }, [screen, currentIndex, currentType, targetChar]);

  const startGame = (difficultyKey) => {
    clearTimeout(timerRef.current);
    setDifficulty(difficultyKey);
    setQuestions(generateQuestions({ chars: allChars, difficulty: difficultyKey, weakIds }));
    setCurrentIndex(0);
    setScore(0);
    setHearts(getDifficulty(difficultyKey).hearts);
    setFeedback(null);
    setSelectedOption(null);
    setSpeechAvailable(isSpeechAvailable());
    setScreen('playing');
  };

  const finishGame = (cleared) => {
    if (cleared) {
      setScreen('result');
      playHappy1Sound();
      triggerConfetti();
    } else {
      setScreen('failed');
    }
  };

  const handleAnswer = (option) => {
    if (feedback) return; // 連打防止

    const isCorrect = option.id === currentQuestion.target.id;
    setSelectedOption(option);

    let nextHearts = hearts;
    let nextQuestions = questions;

    if (isCorrect) {
      playOK1Sound();
      setFeedback('correct');
      if (!currentQuestion.isRetry) setScore((s) => s + 1);
    } else {
      playWrongSound();
      setFeedback('incorrect');
      nextHearts = hearts - 1;
      setHearts(nextHearts);
      setWeakIds((ids) => (ids.includes(currentQuestion.target.id) ? ids : [...ids, currentQuestion.target.id]));
      // 再出題は1回まで（再出題で間違えても、さらには差し込まない）
      if (!currentQuestion.isRetry) {
        const retryQuestion = buildQuestion({
          target: currentQuestion.target,
          chars: allChars,
          difficulty,
          isRetry: true,
        });
        nextQuestions = insertRetry({ questions, currentIndex, retryQuestion });
        setQuestions(nextQuestions);
      }
    }

    timerRef.current = setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);

      if (nextHearts <= 0) {
        finishGame(false);
      } else if (currentIndex < nextQuestions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        finishGame(true);
      }
    }, FEEDBACK_MS);
  };

  const renderPrompt = (question, questionType) => {
    if (questionType === 'sound-to-char') {
      return (
        <button
          className="speak-btn"
          onClick={() => speak(question.target.char, () => setSpeechAvailable(false))}
          aria-label="もういちど きく"
        >
          🔊
        </button>
      );
    }
    return questionType === 'char-to-romaji' ? question.target.char : question.target.romaji;
  };

  const renderResultOverlay = (title, emoji) => (
    <div className="adventure-result-overlay">
      <div className="result-title">{title}</div>
      <div className="winner-emoji" style={{ fontSize: '6rem', marginBottom: '1rem' }}>{emoji}</div>
      <div className="result-score">
        スコア: {score} / {countScoredQuestions(questions)}
      </div>
      <div className="result-buttons">
        <button className="game-button" onClick={() => startGame(difficulty)}>
          もう一度挑戦
        </button>
        <button className="game-button" onClick={() => setScreen('select')}>
          むずかしさを かえる
        </button>
      </div>
    </div>
  );

  if (screen === 'select') {
    return (
      <div className="kana-adventure-game">
        <AdventureScene />
        <DifficultySelect onSelect={startGame} />
      </div>
    );
  }

  const maxHearts = getDifficulty(difficulty).hearts;
  const pathHeight = PATH_PADDING_TOP + questions.length * NODE_HEIGHT + PATH_PADDING_BOTTOM;
  const roadD = buildPathD({
    count: questions.length,
    pathHeight,
    nodeHeight: NODE_HEIGHT,
    paddingBottom: PATH_PADDING_BOTTOM,
  });

  return (
    <div className="kana-adventure-game">
      {/* ハート表示 */}
      <div className="hearts-bar">
        {Array.from({ length: maxHearts }, (_, i) => (
          <span key={i}>{i < hearts ? '❤️' : '🤍'}</span>
        ))}
      </div>

      {/* Scrollable Map Area */}
      <div className="adventure-scroll-container">
        <div className="adventure-path-container" style={{ minHeight: `${pathHeight}px` }}>
          <AdventureScene />
          <svg className="winding-path-svg" viewBox={`0 0 100 ${pathHeight}`} preserveAspectRatio="none">
            <path className="adventure-road" d={roadD} />
            <path className="adventure-road-dots" d={roadD} />
          </svg>

          {/* ステージ描画（CSS の column-reverse で下から上に並ぶ） */}
          {questions.map((q, idx) => {
            const isActive = idx === currentIndex && screen === 'playing';
            const isCleared = idx < currentIndex;
            const isLocked = idx > currentIndex;
            const positionClass = idx % 2 === 0 ? 'left' : 'right';
            const questionType = resolveType(q.type, speechAvailable);

            return (
              <div
                key={idx}
                className={`stage-node ${positionClass} ${isActive ? 'active' : ''} ${isCleared ? 'cleared' : ''} ${isLocked ? 'locked' : ''}`}
                ref={isActive ? activeStageRef : null}
              >
                <div className="stage-content">
                  {isActive ? (
                    <div className="quiz-active-container">
                      <div className="quiz-header-simple">
                        {q.isRetry ? 'もういちど！' : `もんだい ${questions.slice(0, idx + 1).filter((x) => !x.isRetry).length}`}
                      </div>

                      <div className="quiz-question-text">{renderPrompt(q, questionType)}</div>

                      <div className="quiz-options-grid">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOption === opt;
                          const isCorrect = opt.id === q.target.id;
                          const optionText = questionType === 'char-to-romaji' ? opt.romaji : opt.char;
                          let btnClass = 'quiz-option-btn';

                          if (feedback) {
                            if (isCorrect) btnClass += ' correct';
                            else if (isSelected) btnClass += ' incorrect';
                          }

                          return (
                            <button
                              key={optIdx}
                              className={btnClass}
                              onClick={() => handleAnswer(opt)}
                              disabled={!!feedback}
                            >
                              {optionText}
                            </button>
                          );
                        })}
                      </div>

                      <div className="player-avatar">🦁</div>
                    </div>
                  ) : isCleared ? (
                    <div className="stage-marker">🚩</div>
                  ) : (
                    <div className="stage-marker">🔒</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {screen === 'result' && renderResultOverlay('冒険クリア！', '🏔️🎉')}
      {screen === 'failed' && renderResultOverlay('ざんねん…', '😢')}
    </div>
  );
};

export default KanaAdventureGame;
