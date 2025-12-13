import React, { useState, useEffect } from 'react';
import { playOK1Sound, playNGSound, playFinishSound } from '../../../utils/soundPlayer';
import '../KanjiCard/KanjiGames.css'; // Re-use styles

const QUESTIONS = [
  {
    id: 1,
    title: '文作り（１）',
    instruction: '正しい言葉を選んで、文を完成させよう！',
    text: '私は{0}で{1}を書いて、{2}に{3}を送りました。{4}が届くといいな。',
    words: ['鉛筆', '手紙', '先生', '感謝', '返事']
  },
  {
    id: 2,
    title: '文作り（２）',
    instruction: '空欄に言葉を入れてみよう',
    text: '日曜日は{0}へ行って、{1}を見ました。とても{2}かったです。帰りに{3}を食べて、{4}しました。',
    words: ['公園', '花', '美し', 'アイス', '満足']
  },
  {
    id: 3,
    title: '文作り（３）',
    instruction: '言葉を選んでね',
    text: '朝起きて、{0}を洗い、{1}を食べました。それから{2}を持って、{3}へ行きました。{4}遅刻しそうでした。',
    words: ['顔', '朝ご飯', '教科書', '学校', '危うく']
  }
];

const FillInTheBlankGame = ({ onClose }) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedCard, setSelectedCard] = useState(null);
  const [placedCards, setPlacedCards] = useState({}); // { blankIndex: cardId }
  const [cards, setCards] = useState([]);
  const [gameState, setGameState] = useState('playing'); // playing, won
  const [feedback, setFeedback] = useState(null); // null, 'correct', 'incorrect'
  const [score, setScore] = useState(0);

  const config = QUESTIONS[currentQuestionIndex];

  useEffect(() => {
    initGame();
  }, [currentQuestionIndex]);

  const initGame = () => {
    setPlacedCards({});
    setSelectedCard(null);
    setGameState('playing');
    setFeedback(null);
    
    if (config && config.words) {
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
    if (currentQuestionIndex < QUESTIONS.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
    } else {
      // Loop back to start or randomize? Let's loop for now
      setCurrentQuestionIndex(0);
    }
  };

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
        <h2>{config.title}</h2>
        <div className="score">Score: {score}</div>
      </div>
      
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
        <div className="game-result-modal" style={{position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'white', padding: '20px', borderRadius: '10px', boxShadow: '0 0 20px rgba(0,0,0,0.2)', textAlign: 'center', zIndex: 100}}>
          <h2>🎉 正解！おめでとう！ 🎉</h2>
          <div style={{marginTop: '20px'}}>
             <button className="start-btn" onClick={handleNext}>次の問題へ</button>
          </div>
        </div>
      )}

      <style>{`
        .fill-blank-game {
          padding: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 20px;
          max-width: 800px;
          margin: 0 auto;
          position: relative;
          min-height: 500px;
        }
        .game-header-info {
          display: flex;
          justify-content: space-between;
          width: 100%;
          align-items: center;
          margin-bottom: 10px;
        }
        .sentence-area {
          font-size: 1.5rem;
          line-height: 2.5;
          background: white;
          padding: 30px;
          border-radius: 15px;
          box-shadow: 0 4px 15px rgba(0,0,0,0.1);
          width: 100%;
          text-align: left;
        }
        .blank-slot {
          display: inline-block;
          min-width: 80px;
          height: 2.2rem;
          border-bottom: 3px solid #ccc;
          margin: 0 5px;
          text-align: center;
          cursor: pointer;
          color: #333;
          transition: all 0.3s;
          padding: 0 10px;
          background: #f5f5f5;
          border-radius: 4px;
        }
        .blank-slot.highlight {
          border-bottom-color: #4ECDC4;
          background: #e0f2f1;
        }
        .blank-slot.filled {
          border-bottom-color: #FF9F43;
          background: #FFF3E0;
          font-weight: bold;
        }
        .cards-area {
          display: flex;
          gap: 15px;
          flex-wrap: wrap;
          justify-content: center;
          padding: 20px;
          background: rgba(255,255,255,0.5);
          border-radius: 12px;
          width: 100%;
        }
        .cards-area.incorrect {
          animation: shake 0.5s;
        }
        .word-card {
          background: white;
          border: 2px solid #ddd;
          padding: 10px 20px;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1.2rem;
          font-weight: bold;
          box-shadow: 0 2px 5px rgba(0,0,0,0.1);
          transition: transform 0.2s, border-color 0.2s;
        }
        .word-card:hover {
          transform: translateY(-2px);
        }
        .word-card.selected {
          border-color: #4ECDC4;
          background-color: #E0F7FA;
          transform: scale(1.1);
          box-shadow: 0 4px 10px rgba(78, 205, 196, 0.3);
        }
        .word-card.placed {
          opacity: 0.3;
          cursor: default;
          transform: none;
          pointer-events: none;
        }
        @keyframes shake {
          0% { transform: translateX(0); }
          25% { transform: translateX(-10px); }
          75% { transform: translateX(10px); }
          100% { transform: translateX(0); }
        }
      `}</style>
    </div>
  );
};

export default FillInTheBlankGame;
