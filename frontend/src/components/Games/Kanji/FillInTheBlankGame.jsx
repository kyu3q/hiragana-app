import React, { useState, useEffect } from 'react';
import { playOK1Sound, playNGSound, playFinishSound } from '../../../utils/soundPlayer';
import { triggerConfetti, triggerFireworks } from '../../../utils/confettiEffect';
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
  const [solvedCount, setSolvedCount] = useState(0);

  // Derived state for checking if a card is placed
  const isCardPlaced = (cardId) => Object.values(placedCards).includes(cardId);

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
        // isPlaced removed from state object, derived instead
      }));
      // Shuffle cards
      setCards(initialCards.sort(() => Math.random() - 0.5));
    }
  };

  const handleCardClick = (card) => {
    if (gameState !== 'playing') return;
    if (isCardPlaced(card.id)) return;

    if (selectedCard && selectedCard.id === card.id) {
      setSelectedCard(null); // Deselect
    } else {
      setSelectedCard(card);
      playOK1Sound();
    }
  };

  const handlePlaceCard = (blankIndex, cardId) => {
    if (gameState !== 'playing') return;

    const newPlacedCards = { ...placedCards };

    // Remove card from previous slot if any (move operation)
    const oldKey = Object.keys(newPlacedCards).find(key => newPlacedCards[key] === cardId);
    if (oldKey) {
      delete newPlacedCards[oldKey];
    }

    // Assign to new slot
    newPlacedCards[blankIndex] = cardId;

    setPlacedCards(newPlacedCards);
    setSelectedCard(null);
    playOK1Sound();

    // Check if all blanks are filled
    const totalBlanks = (config.text.match(/\{(\d+)\}/g) || []).length;
    
    if (Object.keys(newPlacedCards).length === totalBlanks) {
      checkResult(newPlacedCards);
    }
  };

  const handleBlankClick = (blankIndex) => {
    if (gameState !== 'playing') return;

    const existingCardId = placedCards[blankIndex];

    if (selectedCard) {
        // Place selected card (replaces if exists)
        handlePlaceCard(blankIndex, selectedCard.id);
    } else if (existingCardId !== undefined) {
        // Remove existing card
        setPlacedCards(prev => {
            const newPlaced = { ...prev };
            delete newPlaced[blankIndex];
            return newPlaced;
        });
    }
  };

  // Drag and Drop Handlers
  const handleDragStart = (e, cardId) => {
    if (gameState !== 'playing') {
        e.preventDefault();
        return;
    }
    e.dataTransfer.setData("text/plain", cardId.toString());
    e.dataTransfer.effectAllowed = "move";
    // Optionally highlight drop zones
  };

  const handleDragOver = (e) => {
    e.preventDefault(); // Necessary to allow dropping
    e.dataTransfer.dropEffect = "move";
  };

  const handleDrop = (e, blankIndex) => {
    e.preventDefault();
    const cardIdStr = e.dataTransfer.getData("text/plain");
    if (!cardIdStr) return;
    const cardId = parseInt(cardIdStr);
    
    // Validate card exists
    if (!cards.find(c => c.id === cardId)) return;

    handlePlaceCard(blankIndex, cardId);
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
      triggerConfetti();
      setFeedback('correct');
      setScore(prev => prev + 100);
    } else {
      playNGSound();
      setFeedback('incorrect');
      setTimeout(() => setFeedback(null), 1000);
    }
  };

  const handleNext = () => {
    let nextSolvedCount = solvedCount;
    if (gameState === 'won') {
      nextSolvedCount = solvedCount + 1;
      setSolvedCount(nextSolvedCount);
    }

    if (nextSolvedCount >= 10) {
      setGameState('finished');
      triggerFireworks();
    } else {
      setCurrentQuestionIndex(prev => {
        if (prev < questions.length - 1) {
          return prev + 1;
        } else {
          return 0; // Loop back to start if questions run out
        }
      });
    }
  };

  const handleSkip = () => {
    playNGSound();
    handleNext();
  };

  const handleRestart = () => {
      const shuffled = [...QUESTIONS].sort(() => Math.random() - 0.5);
      setQuestions(shuffled);
      setCurrentQuestionIndex(0);
      setScore(0);
      setSolvedCount(0);
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
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, blankIndex)}
              >
                {placedCard ? (
                  <span 
                    draggable
                    onDragStart={(e) => handleDragStart(e, placedCard.id)}
                    className="draggable-word"
                    style={{ cursor: 'grab', display: 'inline-block', width: '100%' }}
                  >
                    {placedCard.text}
                  </span>
                ) : ' '}
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
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="exit-button" onClick={onClose}>やめる</button>
          <button className="skip-button" onClick={handleSkip}>スキップ</button>
        </div>
        <div className="score">Score: {score}</div>
      </div>

      <div className="progress-bar-container">
        <div 
          className="progress-bar-fill" 
          style={{ width: `${(solvedCount / 10) * 100}%` }}
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
        {cards.map(card => {
          const placed = isCardPlaced(card.id);
          return (
            <div
              key={card.id}
              className={`word-card ${placed ? 'placed' : ''} ${selectedCard?.id === card.id ? 'selected' : ''}`}
              onClick={() => handleCardClick(card)}
              draggable={!placed}
              onDragStart={(e) => handleDragStart(e, card.id)}
            >
              {card.text}
            </div>
          );
        })}
      </div>

      {gameState === 'won' && (
        <div className="game-result-overlay">
          <h2>🎉 正解！おめでとう！ 🎉</h2>
          <div className="result-buttons">
             <button className="next-button" onClick={handleNext}>
               {solvedCount < 9 ? '次の問題へ' : '結果を見る'}
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
