import React, { useState, useEffect, useRef } from 'react';

const CatchGame = ({ config, onComplete, onAddScore }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [catcherPos, setCatcherPos] = useState(50); // %
  const [items, setItems] = useState([]);
  const [score, setScore] = useState(0);
  const containerRef = useRef(null);

  // Catcher movement
  const handleMouseMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    const pos = Math.max(10, Math.min(90, (x / width) * 100));
    setCatcherPos(pos);
  };

  const handleTouchMove = (e) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.touches[0].clientX - rect.left;
    const width = rect.width;
    const pos = Math.max(10, Math.min(90, (x / width) * 100));
    setCatcherPos(pos);
  };

  // Spawn items
  useEffect(() => {
    if (!isPlaying) return;
    
    const spawnInterval = setInterval(() => {
      const isTarget = Math.random() > 0.4;
      setItems(prev => [...prev, {
        id: Date.now(),
        x: Math.random() * 80 + 10,
        y: -10,
        char: isTarget ? config.targetChar : config.badChar,
        isTarget: isTarget,
        speed: Math.random() * 1 + 0.5 // 0.5 - 1.5 % per tick? No, maybe pixels.
      }]);
    }, 1200);

    return () => clearInterval(spawnInterval);
  }, [isPlaying, config]);

  // Game Loop
  useEffect(() => {
    if (!isPlaying) return;

    const gameLoop = setInterval(() => {
      setItems(prev => {
        const nextItems = [];
        let scoreToAdd = 0;

        prev.forEach(item => {
          const newY = item.y + 1.5; // Fall speed
          
          // Check collision with catcher
          // Catcher is at bottom: 20px from bottom.
          // Let's assume height is 100% ~ 400px?
          // Collision check logic:
          // Item Y > 85% AND Item X close to Catcher X
          
          if (newY > 80 && newY < 95) {
             if (Math.abs(item.x - catcherPos) < 15) {
               // Caught!
               if (item.isTarget) {
                 scoreToAdd += 10;
                 // Play sound?
               } else {
                 scoreToAdd -= 10;
                 // Ouch
               }
               return; // Remove item
             }
          }

          if (newY > 110) {
            // Missed
            return;
          }

          nextItems.push({ ...item, y: newY });
        });
        
        if (scoreToAdd !== 0) {
           onAddScore(scoreToAdd);
           setScore(s => {
             const newScore = s + scoreToAdd;
             if (newScore >= 50) { // Win condition: 50 points
               setIsPlaying(false);
               onComplete(true);
             }
             return newScore;
           });
        }
        
        return nextItems;
      });
    }, 16); // 60fps

    return () => clearInterval(gameLoop);
  }, [isPlaying, catcherPos]);

  return (
    <div 
      className="game-area catch-game" 
      style={{ background: config.bg }}
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onTouchMove={handleTouchMove}
    >
      {!isPlaying && score < 50 && (
        <div className="game-instruction-overlay">
          <h3>{config.title}</h3>
          <p>{config.instruction}</p>
          <button className="start-btn" onClick={() => setIsPlaying(true)}>スタート！</button>
        </div>
      )}

      {/* Catcher */}
      <div className="catcher" style={{ left: `${catcherPos}%` }}>
        🧺
      </div>

      {/* Items */}
      {items.map(item => (
        <div 
          key={item.id} 
          className="falling-item"
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
        >
          {item.char}
        </div>
      ))}
      
      <div style={{ position: 'absolute', top: 10, left: 10, color: '#333', fontWeight: 'bold' }}>
        スコア: {score} / 50
      </div>

    </div>
  );
};

export default CatchGame;
