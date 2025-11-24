import React, { useState, useEffect, useRef } from 'react';

const TapGame = ({ config, onComplete, onAddScore }) => {
  const [items, setItems] = useState([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [foundCount, setFoundCount] = useState(0);
  const timerRef = useRef(null);
  
  const spawnItem = () => {
    const isTarget = Math.random() > 0.3; // 70% chance to be target
    const newItem = {
      id: Date.now(),
      char: isTarget ? config.distractorChar : config.targetChar, // Note: Logic swap? Wait.
      // If we want to find "Sun", we might need to clear "Clouds".
      // Let's assume config.targetChar is what we want to FIND/REVEAL, or config.distractorChar is what we TAP to remove?
      // Re-reading config: "くもをタップして、お日さまをみつけよう" -> Tap clouds (distractor) to reveal/find Sun? 
      // Or maybe "Tap the Sun hiding among clouds".
      // Let's go with: Tap the distractor (Cloud) to clear it, or Tap the Target (Sun) to collect it.
      // Instruction says "くもをタップして" (Tap clouds). So Clouds are the clickable targets in this context?
      // But usually you want to find the character.
      // Let's interpret: "Tap Clouds to make them disappear, if Sun appears, tap Sun to win".
      // Let's simplify: Tap the TARGET items.
      // Config: targetChar: '日', distractorChar: '☁️'
      // Let's make it: Tap '日' to collect points. Avoid tapping '☁️'.
      // Wait, the instruction says "Tap clouds". Let's stick to the instruction.
      // "Tap clouds to find sun" -> Maybe Tap Cloud -> It turns into Sun or disappears revealing Sun?
      
      // Let's simplify for "One Char One Game": 
      // The goal is to interact with the character.
      // Let's just spawn targets and distractors. User taps targets.
      // If config says "Tap clouds", then Cloud is the target for the click event.
      // But to avoid confusion, let's implement a standard "Tap the Correct Character" game first, 
      // or "Tap the Object associated with the character".
      // Let's assume user taps `distractorChar` (Cloud) to remove it.
      // Or user taps `targetChar` (Sun) to collect it.
      // Given the config "targetCount: 5", let's assume we need to collect 5 Suns.
      
      x: Math.random() * 80 + 10, // 10-90%
      y: Math.random() * 80 + 10,
      isTarget: false // We'll set this below
    };
    
    // Logic: 
    // If we want to tap Clouds to find Sun, maybe clouds hide suns?
    // Let's implement: Spawning items. Some are Clouds, Some are Suns.
    // Tapping Sun = Good. Tapping Cloud = Bad? 
    // Or Tapping Cloud = Poof, revealing Sun?
    
    // Let's go with simple: Tap the `targetChar` (Sun). 
    // `distractorChar` (Cloud) just floats around blocking view.
    
    if (Math.random() > 0.4) {
      newItem.char = config.targetChar;
      newItem.isTarget = true;
    } else {
      newItem.char = config.distractorChar;
      newItem.isTarget = false;
    }
    
    setItems(prev => [...prev, newItem]);
  };

  useEffect(() => {
    if (isPlaying) {
      const interval = setInterval(spawnItem, config.spawnInterval || 1000);
      return () => clearInterval(interval);
    }
  }, [isPlaying, config]);

  const handleTap = (item) => {
    if (!isPlaying) return;
    
    if (item.isTarget) {
      // Correct tap
      onAddScore(10);
      setFoundCount(prev => {
        const newCount = prev + 1;
        if (newCount >= config.targetCount) {
          onComplete(true);
        }
        return newCount;
      });
      // Remove item
      setItems(prev => prev.filter(i => i.id !== item.id));
    } else {
      // Wrong tap
      onAddScore(-5);
      // Maybe shake animation?
    }
  };

  useEffect(() => {
    // Cleanup items that are too old? For now, let them stay.
    return () => {};
  }, []);

  return (
    <div className="game-area tap-game" style={{ background: config.bg }}>
      {!isPlaying && (
        <div className="game-instruction-overlay">
          <h3>{config.title}</h3>
          <p>{config.instruction}</p>
          <button className="start-btn" onClick={() => setIsPlaying(true)}>スタート！</button>
        </div>
      )}
      
      {items.map(item => (
        <div
          key={item.id}
          className={`tap-target ${item.char === config.distractorChar ? 'cloud' : ''}`}
          style={{ left: `${item.x}%`, top: `${item.y}%` }}
          onClick={(e) => {
            e.stopPropagation();
            handleTap(item);
          }}
        >
          {item.char}
        </div>
      ))}
      
      <div style={{ position: 'absolute', top: 10, left: 10, color: 'white', fontWeight: 'bold' }}>
        あと {Math.max(0, config.targetCount - foundCount)} こ
      </div>
    </div>
  );
};

export default TapGame;
