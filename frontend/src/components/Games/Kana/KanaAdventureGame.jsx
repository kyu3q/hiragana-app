import React, { useState, useEffect, useRef } from 'react';
import './KanaAdventureGame.css';
import { hiraganaGroups } from '../../../data/hiraganaData';
import { katakanaGroups } from '../../../data/katakanaData';
import { playOK1Sound, playWrongSound, playHappy1Sound } from '../../../utils/soundPlayer';
import { triggerConfetti } from '../../../utils/confettiEffect';

const KanaAdventureGame = ({ onClose, type }) => {
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [gameState, setGameState] = useState('playing'); // 'playing', 'result'
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
  const [selectedOption, setSelectedOption] = useState(null);
  
  // Ref for auto-scrolling
  const scrollContainerRef = useRef(null);
  const activeStageRef = useRef(null);

  // Get data based on type
  const dataGroups = type === 'katakana' ? katakanaGroups : hiraganaGroups;
  const allChars = dataGroups.flatMap(g => g.characters);

  // Initialize Game
  useEffect(() => {
    initGame();
  }, [type]);

  // Auto-scroll to active stage
  useEffect(() => {
    if (activeStageRef.current && scrollContainerRef.current) {
      activeStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex, gameState]);

  const initGame = () => {
    const generatedQuestions = generateQuestions(10);
    setQuestions(generatedQuestions);
    setCurrentIndex(0);
    setScore(0);
    setGameState('playing');
    setFeedback(null);
    setSelectedOption(null);
  };

  const generateQuestions = (count) => {
    const shuffledChars = [...allChars].sort(() => 0.5 - Math.random());
    const selectedChars = shuffledChars.slice(0, count);

    return selectedChars.map(target => {
      // 50% chance: Show Char -> Pick Romaji
      // 50% chance: Show Romaji -> Pick Char
      const mode = Math.random() > 0.5 ? 'char-to-romaji' : 'romaji-to-char';
      
      // Generate distractors
      const distractors = [];
      const otherChars = allChars.filter(c => c.id !== target.id);
      
      while (distractors.length < 3) {
        const d = otherChars[Math.floor(Math.random() * otherChars.length)];
        if (!distractors.includes(d)) {
          distractors.push(d);
        }
      }

      const options = [target, ...distractors].sort(() => 0.5 - Math.random());

      return {
        target,
        mode,
        options
      };
    });
  };

  const handleAnswer = (option) => {
    if (feedback) return; // Prevent multiple clicks

    const currentQ = questions[currentIndex];
    const isCorrect = option.id === currentQ.target.id;
    setSelectedOption(option);

    if (isCorrect) {
      playOK1Sound();
      setFeedback('correct');
      setScore(s => s + 1);
    } else {
      playWrongSound();
      setFeedback('incorrect');
    }

    setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);
      
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(prev => prev + 1);
      } else {
        finishGame();
      }
    }, 1000);
  };

  const finishGame = () => {
    setGameState('result');
    playHappy1Sound();
    triggerConfetti();
  };

  if (questions.length === 0) return <div>Loading...</div>;

  return (
    <div className="kana-adventure-game">
      {/* Background Layer */}
      <div className="mountain-bg">
        {/* Decorative Clouds */}
        <div className="cloud-decoration" style={{ top: '10%', width: '100px', height: '60px', left: '-120px', animationDelay: '0s' }}></div>
        <div className="cloud-decoration" style={{ top: '30%', width: '150px', height: '90px', left: '-200px', animationDelay: '5s' }}></div>
        <div className="cloud-decoration" style={{ top: '60%', width: '120px', height: '70px', left: '-150px', animationDelay: '10s' }}></div>
        <div className="cloud-decoration" style={{ top: '80%', width: '180px', height: '100px', left: '-220px', animationDelay: '2s' }}></div>
      </div>
      
      {/* Scrollable Map Area */}
      <div className="adventure-scroll-container" ref={scrollContainerRef}>
        <div className="adventure-path-container">
          {/* Path SVG Line (Reduced Height) */}
          <svg className="winding-path-svg" viewBox="0 0 100 1650" preserveAspectRatio="none">
             <path 
               d={`M 50 1650 
                  ${questions.map((_, i) => {
                    // Total content height approx 1650 (100 pad top + 10*140 + 150 pad bottom)
                    // Node 0 center = 1650 - 150 - 70 = 1430
                    const y = 1430 - (i * 140); 
                    const x = i % 2 === 0 ? 20 : 80; // Left(20), Right(80)
                    return `L ${x} ${y}`;
                  }).join(' ')}`}
               fill="none" 
               stroke="#8D6E63" 
               strokeWidth="3"
               strokeDasharray="15, 10"
             />
          </svg>

          {/* Render Questions (Stages) - Reversed visually by CSS flex-direction: column-reverse */}
          {questions.map((q, idx) => {
            const isActive = idx === currentIndex && gameState === 'playing';
            const isCleared = idx < currentIndex;
            const isLocked = idx > currentIndex;
            const positionClass = idx % 2 === 0 ? 'left' : 'right';
            
            const questionText = q.mode === 'char-to-romaji' ? q.target.char : q.target.romaji;

            return (
              <div 
                key={idx} 
                className={`stage-node ${positionClass} ${isActive ? 'active' : ''} ${isCleared ? 'cleared' : ''} ${isLocked ? 'locked' : ''}`}
                ref={isActive ? activeStageRef : null}
              >
                <div className="stage-content">
                  {isActive ? (
                    /* Active Quiz - Minimalist (No Card BG) */
                    <div className="quiz-active-container">
                      <div className="quiz-header-simple">
                        もんだい {idx + 1}
                      </div>
                      
                      <div className="quiz-question-text">
                         {questionText}
                      </div>

                      <div className="quiz-options-grid">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOption === opt;
                          const isCorrect = opt.id === q.target.id;
                          const optionText = q.mode === 'char-to-romaji' ? opt.romaji : opt.char;
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
                      
                      {/* Avatar at current position */}
                      <div className="player-avatar">
                        🦁
                      </div>
                    </div>
                  ) : isCleared ? (
                    /* Cleared Marker */
                    <div className="stage-marker">
                      🚩
                    </div>
                  ) : (
                    /* Locked Marker */
                    <div className="stage-marker">
                      🔒
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Result Overlay */}
      {gameState === 'result' && (
        <div className="adventure-result-overlay">
          <div className="result-title">冒険クリア！</div>
          <div className="winner-emoji" style={{ fontSize: '6rem', marginBottom: '1rem' }}>🏔️🎉</div>
          <div className="result-score">
            スコア: {score} / {questions.length}
          </div>
          <button className="game-button" onClick={initGame} style={{ marginTop: '20px', fontSize: '1.5rem', padding: '1rem 2rem' }}>
            もう一度挑戦
          </button>
        </div>
      )}
    </div>
  );
};

export default KanaAdventureGame;
