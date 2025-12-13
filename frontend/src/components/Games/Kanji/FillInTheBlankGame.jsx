import React, { useState, useEffect } from 'react';
import { playOK1Sound, playNGSound, playFinishSound } from '../../../utils/soundPlayer';
import { QUESTIONS } from '../../../data/fillInTheBlankQuestions';
import '../KanjiCard/KanjiGames.css'; // Re-use common styles
import './FillInTheBlankGame.css'; // Specific styles

const FillInTheBlankGame = ({ onClose }) => {
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [placedCards, setPlacedCards] = useState({}); // { blankIndex: cardId }
  const [cards, setCards] = useState([]);
  const [gameState, setGameState] = useState('loading'); // loading, playing, won, finished
  const [feedback, setFeedback] = useState(null); // null, 'correct', 'incorrect'
  const [score, setScore] = useState(0);

  // Initialize questions (shuffle)
  useEffect(() => {
    const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
    setQuestions(shuffled);
    setGameState('playing');
  }, []);

  const config = questions[currentQuestionIndex];

  // Reset game state when config changes
  useEffect(() => {
    if (config) {
      initGame();
    }
  }, [config]);

  const initGame = () => {
    if (!config) return;
    setPlacedCards({});
    setSelectedCard(null);
    setGameState('playing');
    setFeedback(null);
    
    if (config.words) {
      const initialCards = config.words.map((word, index) => ({
        id: index,
        text: word,
        isPlaced: false
      }));
      // Shuffle cards
      setCards(initialCards.sort(() => Math.random() - 0.5));
    }
  };

  const handleCardClick = (card) => {
    if (gameState !== 'playing') return;
    if (card.isPlaced) return;

    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null); // Deselect
    } else {
      setSelectedCard(card);
      playOK1Sound();
    }
  };

  const handleBlankClick = (blankIndex) => {
    if (gameState !== 'playing') return;

    // If a card is already placed here, remove it and return it to the pool
    if (placedCards[blankIndex] !== undefined) {
      const removedCardId = placedCards[blankIndex];
      setPlacedCards(prev => {
        const newPlaced = { ...prev };
        delete newPlaced[blankIndex];
        return newPlaced;
      });
      setCards(prev => prev.map(c => 
        c.id === removedCardId ? { ...c, isPlaced: false } : c
      ));
      return; 
    }

    if (!selectedCard) return;

    // Place the selected card
    setPlacedCards(prev => ({
      ...prev,
      [blankIndex]: selectedCard.id
    }));
    
    setCards(prev => prev.map(c => 
      c.id === selectedCard.id ? { ...c, isPlaced: true } : c
    ));
    
    setSelectedCard(null);
    playOK1Sound();

    // Check if all blanks are filled
    const totalBlanks = (config.text.match(/\{(\d+)\}/g) || []).length;
    const newPlacedCards = { ...placedCards, [blankIndex]: selectedCard.id };
    
    if (Object.keys(newPlacedCards).length === totalBlanks) {
      checkResult(newPlacedCards);
    }
  };

  const checkResult = (currentPlacedCards) => {
    // Check if correct
    let isCorrect = true;
    Object.entries(currentPlacedCards).forEach(([blankIndex, cardId]) => {
      if (parseInt(blankIndex) !== cardId) {
        isCorrect = false;
      }
    });

    if (isCorrect) {
      setGameState('won');
      playFinishSound();
      setFeedback('correct');
      setScore(prev => prev + 100);
    } else {
      playNGSound();
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      setGameState('finished');
    }
  };

  const handleRestart = () => {
      const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setGameState('playing');
  };

  if (!config || gameState === 'loading') return <div>Loading...</div>;

  const renderSentence = () => {
    if (!config.text) return null;
    
    const parts = config.text.split(/\{(\d+)\}/);
    
    return (
      <div className="sentence-container">
        {parts.map((part, index) => {
          if (index % 2 === 1) { // This is a placeholder ID
            const blankIndex = parseInt(part);
            const placedCardId = placedCards[blankIndex];
            const placedCard = cards.find(c => c.id === placedCardId);

            return (
              <span 
                key={index} 
                className={`blank-slot ${placedCard ? 'filled' : ''} ${selectedCard ? 'highlight' : ''}`}
                onClick={() => handleBlankClick(blankIndex)}
              >
                {placedCard ? placedCard.text : '____'}
              </span>
            );
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    );
  };

  return (
    <div className="fill-blank-game">
      <div className="game-header-info">
        <button className="exit-button" onClick={onClose}>やめる</button>
        <div className="score">Score: {score}</div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${((currentQuestionIndex) / questions.length) * 100}%` }}
        ></div>
      </div>
      
      <h2>{config.title}</h2>
      
      <div className="game-instruction">
        {config.instruction}
      </div>

      <div className="sentence-area">
        {renderSentence()}
      </div>

      <div className={`cards-area ${feedback}`}>
        {cards.map(card => (
          <div
            key={card.id}
            className={`word-card ${card.isPlaced ? 'placed' : ''} ${selectedCard?.id === card.id ? 'selected' : ''}`}
            onClick={() => handleCardClick(card)}
          >
            {card.text}
          </div>
        ))}
      </div>

      {gameState === 'won' && (
        <div className="game-result-overlay">
          <h2>🎉 正解！おめでとう！ 🎉</h2>
          <div className="result-buttons">
             <button className="next-button" onClick={handleNext}>
               {currentQuestionIndex < questions.length - 1 ? '次の問題へ' : '結果を見る'}
             </button>
          </div>
        </div>
      )}

      {gameState === 'finished' && (
        <div className="game-result-overlay">
          <h2>🏆 全問クリア！ 🏆</h2>
          <p style={{fontSize: '1.5rem', marginBottom: '20px'}}>スコア: {score}</p>
          <div className="result-buttons">
             <button className="next-button" onClick={handleRestart}>もう一度遊ぶ</button>
             <button className="exit-button" onClick={onClose} style={{fontSize: '1.2rem', padding: '10px 30px', borderRadius: '50px'}}>メニューへ戻る</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FillInTheBlankGame;
