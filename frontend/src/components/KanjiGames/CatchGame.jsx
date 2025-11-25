import React, { useState, useEffect, useRef } from 'react';
import { GRADE1_KANJI, SIMILAR_PAIRS } from '../../data/kanjiData';

const SIZES = [30, 45, 60]; // Small, Medium, Large

const CatchGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0); // Keep for React UI (Start/End screens)
  const requestRef = useRef();

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const CATCHER_HEIGHT = 70;
  const CATCHER_Y = 500;

  const getCatcherWidth = (currentScore) => {
    // 70% of 300 is 210
    return currentScore >= 210 ? 110 : 80;
  };

  const stateRef = useRef({
    catcherX: CANVAS_WIDTH / 2,
    items: [],
    particles: [],
    lastSpawn: 0,
    spawnRate: 1000, // ms
    combo: 0,
    isGameOver: false
  });

  const initGame = () => {
    stateRef.current = {
      catcherX: CANVAS_WIDTH / 2,
      items: [],
      particles: [],
      lastSpawn: 0,
      spawnRate: 1000,
      combo: 0,
      isGameOver: false
    };
    setScore(0);
  };

  const spawnItem = () => {
    const now = Date.now();
    if (now - stateRef.current.lastSpawn > stateRef.current.spawnRate) {
      const typeRand = Math.random();
      let type = 'target';
      let char = config.targetChar;
      let color = '#FF9F43';
      let size = SIZES[Math.floor(Math.random() * SIZES.length)];

      // Increase probability of bad/similar items to 60%
      if (typeRand < 0.6) {
        type = 'bad';
        color = '#5D4037';
        // Choose distractor
        const target = config.targetChar;
        let distractor = '';
        
        // 50% chance to use similar character if available
        const useSimilar = Math.random() < 0.5;

        if (useSimilar && SIMILAR_PAIRS[target]) {
            const similars = SIMILAR_PAIRS[target];
            distractor = similars[Math.floor(Math.random() * similars.length)];
        }
        
        // Fallback to random Kanji (or if useSimilar was false)
        if (!distractor) {
            let attempts = 0;
            do {
               distractor = GRADE1_KANJI[Math.floor(Math.random() * GRADE1_KANJI.length)];
               attempts++;
            } while (distractor === target && attempts < 10);
            if (distractor === target) distractor = 'Ｘ';
        }
        char = distractor;

      } else if (typeRand < 0.65) {
        type = 'bonus';
        char = '🌟';
        color = '#FFD700';
        size = 50;
      }

      stateRef.current.items.push({
        x: Math.random() * (CANVAS_WIDTH - size - 20) + size/2 + 10,
        y: -60,
        speed: Math.random() * 2 + 2,
        type: type,
        char: char,
        color: color,
        size: size,
        w: size,
        h: size,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.05
      });
      stateRef.current.lastSpawn = now;
      // Increase difficulty
      stateRef.current.spawnRate = Math.max(400, stateRef.current.spawnRate - 10);
    }
  };

  const createParticles = (x, y, color, count = 10) => {
    for (let i = 0; i < count; i++) {
      stateRef.current.particles.push({
        x: x,
        y: y,
        vx: (Math.random() - 0.5) * 10,
        vy: (Math.random() - 0.5) * 10,
        life: 30,
        color: color
      });
    }
  };

  const update = () => {
    if (gameState !== 'playing' || stateRef.current.isGameOver) return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    spawnItem();

    // Update Items
    state.items.forEach(item => {
      item.y += item.speed;
      item.rotation += item.rotSpeed;
    });

    // Collision Detection
    state.items = state.items.filter(item => {
      // Check collision with catcher
      const currentCatcherWidth = getCatcherWidth(state.score);
      if (
        item.y + item.h > CATCHER_Y &&
        item.y < CATCHER_Y + CATCHER_HEIGHT &&
        item.x + item.w > state.catcherX - currentCatcherWidth / 2 &&
        item.x < state.catcherX + currentCatcherWidth / 2
      ) {
        // Catch!
        if (item.type === 'target') {
          const points = 10 + state.combo;
          onAddScore(points);
          state.score += points;
          setScore(state.score); // Sync React state
          state.combo++;
          createParticles(item.x, item.y, '#FF9F43', 8);
        } else if (item.type === 'bonus') {
          const points = 30;
          onAddScore(points);
          state.score += points;
          setScore(state.score);
          createParticles(item.x, item.y, '#FFD700', 15);
        } else {
          // Bad item
          const points = -10;
          onAddScore(points);
          state.score = Math.max(0, state.score + points);
          setScore(state.score);
          state.combo = 0;
          createParticles(item.x, item.y, '#555', 5);
        }
        return false; // Remove item
      }

      // Missed (Floor)
      if (item.y > CANVAS_HEIGHT) {
        if (item.type === 'target') {
          state.combo = 0; // Combo break on miss
        }
        return false;
      }

      return true;
    });

    // Win Condition
    if (state.score >= 300 && !state.isGameOver) {
      state.isGameOver = true;
      setGameState('won');
      onComplete(true);
    }

    // Update Particles
    state.particles = state.particles.filter(p => p.life > 0);
    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });

    draw(ctx, state);
    // Loop continues with the same function instance
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = (ctx, state) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Background (Sky)
    ctx.fillStyle = config.bg || '#E0F7FA';
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Catcher (Basket)
    const cx = state.catcherX;
    const cy = CATCHER_Y;
    const currentCatcherWidth = getCatcherWidth(state.score);
    
    // Back of basket (inside)
    ctx.fillStyle = '#5D4037';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, currentCatcherWidth/2 - 5, 15, 0, 0, Math.PI * 2);
    ctx.fill();

    // Basket Body
    // Change color if powered up
    ctx.fillStyle = currentCatcherWidth > 80 ? '#A1887F' : '#8D6E63';
    ctx.beginPath();
    ctx.moveTo(cx - currentCatcherWidth/2, cy + 10);
    ctx.lineTo(cx + currentCatcherWidth/2, cy + 10);
    ctx.quadraticCurveTo(cx + currentCatcherWidth/2 + 5, cy + CATCHER_HEIGHT, cx + currentCatcherWidth/2 - 20, cy + CATCHER_HEIGHT);
    ctx.lineTo(cx - currentCatcherWidth/2 + 20, cy + CATCHER_HEIGHT);
    ctx.quadraticCurveTo(cx - currentCatcherWidth/2 - 5, cy + CATCHER_HEIGHT, cx - currentCatcherWidth/2, cy + 10);
    ctx.fill();
    
    // Weave texture
    ctx.strokeStyle = '#6D4C41';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(cx - currentCatcherWidth/2 + 5, cy + 30);
    ctx.quadraticCurveTo(cx, cy + 35, cx + currentCatcherWidth/2 - 5, cy + 30);
    ctx.stroke();

    // Handle (Front)
    // ctx.strokeStyle = '#5D4037';
    // ctx.lineWidth = 4;
    // ctx.beginPath();
    // ctx.moveTo(cx - CATCHER_WIDTH/2 + 10, cy + 10);
    // ctx.bezierCurveTo(cx - CATCHER_WIDTH/2, cy - 40, cx + CATCHER_WIDTH/2, cy - 40, cx + CATCHER_WIDTH/2 - 10, cy + 10);
    // ctx.stroke();
    
    // Items
    state.items.forEach(item => {
      ctx.save();
      ctx.translate(item.x, item.y);
      ctx.rotate(item.rotation);
      
      if (item.type === 'bonus') {
        // Draw Star
        ctx.fillStyle = '#FFD700';
        ctx.font = `${item.size}px Arial`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.char, 0, 0);
        // Glow
        ctx.shadowColor = "white";
        ctx.shadowBlur = 10;
        ctx.fillText(item.char, 0, 0);
      } else {
        // Kanji (Target or Bad)
        // No bubble, just text as requested, but maybe with outline for readability
        ctx.font = `bold ${item.size}px 'Zen Maru Gothic', sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        
        // Outline
        ctx.strokeStyle = 'white';
        ctx.lineWidth = 4;
        ctx.strokeText(item.char, 0, 0);
        
        // Fill
        // Unified color for target and bad items to force reading
        ctx.fillStyle = '#5D4037'; 
        ctx.fillText(item.char, 0, 0);
      }
      ctx.restore();
    });

    // Draw Basket Front Lip (to make items look like they fall inside)
    ctx.fillStyle = '#A1887F';
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, currentCatcherWidth/2, 8, 0, 0, Math.PI, 2*Math.PI); // Semi-circle? No, just thin rim
    // Actually just redraw the top rim for depth if needed, but simple is ok.
    // Let's draw a rim
    ctx.strokeStyle = '#4E342E';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.ellipse(cx, cy + 10, currentCatcherWidth/2, 15, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Particles
    state.particles.forEach(p => {
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life / 30;
      ctx.beginPath();
      ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
    });

    // UI
    ctx.font = "bold 24px Arial";
    ctx.fillStyle = "#333";
    ctx.textAlign = "left";
    ctx.fillText(`スコア: ${state.score} / 300`, 20, 40);
    
    if (state.combo > 1) {
      ctx.fillStyle = "#FF9F43";
      ctx.fillText(`${state.combo} コンボ!`, 20, 70);
    }
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const canvasX = (relativeX / rect.width) * CANVAS_WIDTH;
    const currentWidth = getCatcherWidth(stateRef.current.score);
    stateRef.current.catcherX = Math.max(currentWidth/2, Math.min(CANVAS_WIDTH - currentWidth/2, canvasX));
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const canvasX = (relativeX / rect.width) * CANVAS_WIDTH;
    const currentWidth = getCatcherWidth(stateRef.current.score);
    stateRef.current.catcherX = Math.max(currentWidth/2, Math.min(CANVAS_WIDTH - currentWidth/2, canvasX));
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if(canvas) {
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        // Initial draw
        const ctx = canvas.getContext('2d');
        draw(ctx, stateRef.current);
    }
    initGame();
    return () => cancelAnimationFrame(requestRef.current);
  }, [config]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]); // Removed score dependency to prevent loop restart

  return (
    <div className="game-area catch-game" style={{ background: '#E0F7FA', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || 'キャッチゲーム'}</h3>
          <p>{config.instruction || '落ちてくる文字をカゴでキャッチしよう！'}</p>
          <button className="start-btn" onClick={() => setGameState('playing')}>スタート！</button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: 'white', touchAction: 'none' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
};

export default CatchGame;
