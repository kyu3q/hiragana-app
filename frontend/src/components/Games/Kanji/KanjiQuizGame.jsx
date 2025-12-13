import React, { useState, useEffect, useMemo, useRef } from 'react';
import '../Common/MemoryGame.css'; // Reusing header styles
import './KanjiQuizGame.css';
import { kanjiByGrade } from '../../../data/kanjiData';
import { playMemoryOKSound, playMemoryNGSound, playHappy1Sound, playWrongSound } from '../../../utils/soundPlayer';

const KanjiQuizGame = ({ onClose, type, grade }) => {
  // State
  const [isBattleMode, setIsBattleMode] = useState(true);
  
  const [currentQuestion, setCurrentQuestion] = useState(null);
  
  // Battle State
  const [p1Score, setP1Score] = useState(0);
  const [p2Score, setP2Score] = useState(0);
  const [p1Cooldown, setP1Cooldown] = useState(false);
  const [p2Cooldown, setP2Cooldown] = useState(false);
  const [damageAnim, setDamageAnim] = useState(null); // 'lion' or 'dog' who takes damage

  // Single Player State
  const [singleScore, setSingleScore] = useState(0);
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
  
  const [winner, setWinner] = useState(null);
  const isTransitioning = useRef(false);

  // Helper to get items for grade
  const targetGrade = grade || 1;
  const gradeItems = useMemo(() => {
    const g = kanjiByGrade.find(k => k.grade === targetGrade);
    return g ? g.items : [];
  }, [targetGrade]);

  // Generate a new question
  const generateQuestion = () => {
    if (gradeItems.length < 4) return null;

    // Pick target
    const target = gradeItems[Math.floor(Math.random() * gradeItems.length)];
    
    // Pick sentence
    let sentence = target.story || `「${target.char}」の漢字はどれ？`;
    if (!sentence.includes(target.char)) {
       if (target.example && target.example.includes(target.char)) {
         sentence = target.example;
       } else {
         sentence = `「${target.reading || target.onyomi}」と読む漢字は？`;
       }
    }

    // Mask the char
    const parts = sentence.split(target.char);
    
    // Pick distractors
    const others = gradeItems.filter(i => i.char !== target.char);
    const distractors = [];
    while (distractors.length < 3) {
      const d = others[Math.floor(Math.random() * others.length)];
      if (!distractors.includes(d)) distractors.push(d);
    }

    const baseOptions = [...distractors, target];
    
    // Shuffle for P1/Single
    const optionsP1 = [...baseOptions].sort(() => 0.5 - Math.random());
    // Shuffle for P2
    const optionsP2 = [...baseOptions].sort(() => 0.5 - Math.random());

    return {
      target,
      parts,
      optionsP1,
      optionsP2
    };
  };

  // Init / Reset
  const initGame = () => {
    setP1Score(0);
    setP2Score(0);
    setSingleScore(0);
    setP1Cooldown(false);
    setP2Cooldown(false);
    setWinner(null);
    setFeedback(null);
    setDamageAnim(null);
    isTransitioning.current = false;
    
    const q = generateQuestion();
    setCurrentQuestion(q);
  };

  useEffect(() => {
    initGame();
  }, [targetGrade, isBattleMode]);

  const handleAnswer = (player, option) => {
    if (winner || isTransitioning.current) return;
    if (player === 'lion' && p1Cooldown) return;
    if (player === 'dog' && p2Cooldown) return;

    const isCorrect = option.char === currentQuestion.target.char;

    if (isCorrect) {
      // Correct!
      playMemoryOKSound();
      isTransitioning.current = true; // Block input momentarily

      if (isBattleMode) {
        // Battle Logic
        if (player === 'lion') {
          setP1Score(s => {
            const newScore = s + 1;
            if (newScore >= 5) setWinner('lion');
            return newScore;
          });
          setDamageAnim('dog'); // Dog takes damage
        } else {
          setP2Score(s => {
            const newScore = s + 1;
            if (newScore >= 5) setWinner('dog');
            return newScore;
          });
          setDamageAnim('lion'); // Lion takes damage
        }

        // Delay for animation then next question
        setTimeout(() => {
          setDamageAnim(null);
          if (!winner && (player === 'lion' ? p1Score + 1 : p2Score + 1) < 5) { // Check if game not ended
             setCurrentQuestion(generateQuestion());
             isTransitioning.current = false;
          }
        }, 1000);

      } else {
        // Single Player Logic
        setFeedback('correct');
        setSingleScore(s => s + 1);
        setTimeout(() => {
          setFeedback(null);
          setCurrentQuestion(generateQuestion());
          isTransitioning.current = false;
        }, 1000);
      }

    } else {
      // Incorrect!
      playWrongSound(); // Different sound?
      
      if (isBattleMode) {
        // Penalty: 2 sec cooldown
        if (player === 'lion') {
          setP1Cooldown(true);
          setTimeout(() => setP1Cooldown(false), 2000);
        } else {
          setP2Cooldown(true);
          setTimeout(() => setP2Cooldown(false), 2000);
        }
      } else {
        // Single Player
        setFeedback('incorrect');
        setTimeout(() => {
          setFeedback(null); // Just clear feedback, let them try again? Or next?
          // Usually single player lets retry or moves on. Let's let retry but no score inc.
        }, 1000);
      }
    }
  };

  const handleBattleToggle = () => {
    setIsBattleMode(!isBattleMode);
  };

  if (winner) {
    return (
      <div className="memory-result-area">
        <div className="result-content">
          <div className="winner-emoji" style={{ fontSize: '4rem', marginBottom: '1rem', animation: 'bounce 1s infinite' }}>
            {winner === 'lion' ? '🦁' : '🐶'}
          </div>
          <div className="winner-announcement" style={{
            color: winner === 'lion' ? '#fbbc5d' : '#5eb5fc',
            fontSize: '2.5rem',
            fontWeight: 'bold',
            marginBottom: '1.5rem',
            letterSpacing: '0.1em'
          }}>
            🎉{winner === 'lion' ? 'ライオン' : 'イヌ'}の勝ち！
          </div>
          <div className="result-scores">
            <div className="result-score-row">
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🦁</span>
              <span style={{ fontWeight: 'bold', color: '#fbbc5d' }}>{p1Score}</span>
            </div>
            <div className="result-score-row">
              <span style={{ fontSize: '2rem', marginRight: '0.5rem' }}>🐶</span>
              <span style={{ fontWeight: 'bold', color: '#5eb5fc' }}>{p2Score}</span>
            </div>
          </div>
          <button className="game-button" onClick={initGame} style={{ marginTop: '20px' }}>
            もう一回
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="quiz-game-container">
      <div className="game-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <h2>漢字クイズ</h2>
          <button className="battle-mode-button" onClick={handleBattleToggle}>
            {isBattleMode ? 'ひとりで遊び' : '対決'}
          </button>
        </div>
      </div>

      {currentQuestion && (
        <>
          <div className="quiz-sentence-area">
            <div className="quiz-sentence">
              {currentQuestion.parts.map((part, i) => (
                <React.Fragment key={i}>
                  {part}
                  {i < currentQuestion.parts.length - 1 && (
                    <span className="quiz-blank">
                      {feedback === 'correct' ? currentQuestion.target.char : '？'}
                    </span>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {!isBattleMode && (
            <div className={`quiz-feedback ${feedback || ''}`}>
              {feedback === 'correct' ? 'せいかい！🎉' : feedback === 'incorrect' ? 'ちがうよ…😢' : ''}
            </div>
          )}

          {isBattleMode ? (
            /* Battle Mode Split Layout */
            <div className="battle-area">
              {/* Lion Zone (Left) */}
              <div className={`player-zone lion`}>
                <div className="player-header">
                  <div className={`player-avatar ${damageAnim === 'lion' ? 'shake-damage' : ''}`}>🦁</div>
                  <div className="player-score-display">{p1Score}</div>
                </div>
                <div className="battle-options-grid">
                  {currentQuestion.optionsP1.map((opt) => (
                    <button
                      key={opt.char}
                      className="quiz-option-btn"
                      onClick={() => handleAnswer('lion', opt)}
                      disabled={p1Cooldown}
                    >
                      {opt.char}
                    </button>
                  ))}
                </div>
                {p1Cooldown && (
                  <div className="cooldown-overlay">❌</div>
                )}
              </div>

              {/* Dog Zone (Right) */}
              <div className={`player-zone dog`}>
                <div className="player-header">
                  <div className={`player-avatar ${damageAnim === 'dog' ? 'shake-damage' : ''}`}>🐶</div>
                  <div className="player-score-display">{p2Score}</div>
                </div>
                <div className="battle-options-grid">
                  {currentQuestion.optionsP2.map((opt) => (
                    <button
                      key={opt.char}
                      className="quiz-option-btn"
                      onClick={() => handleAnswer('dog', opt)}
                      disabled={p2Cooldown}
                    >
                      {opt.char}
                    </button>
                  ))}
                </div>
                {p2Cooldown && (
                  <div className="cooldown-overlay">❌</div>
                )}
              </div>
            </div>
          ) : (
            /* Single Player Layout */
            <div className="quiz-options-grid">
              {currentQuestion.optionsP1.map((opt) => (
                <button
                  key={opt.char}
                  className={`quiz-option-btn 
                    ${feedback === 'correct' && opt.char === currentQuestion.target.char ? 'correct' : ''}
                    ${feedback === 'incorrect' && opt.char !== currentQuestion.target.char ? 'disabled' : ''}
                  `}
                  onClick={() => handleAnswer('single', opt)}
                  disabled={!!feedback}
                >
                  {opt.char}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default KanjiQuizGame;
