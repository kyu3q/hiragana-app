import React, { useState, useEffect, useRef } from 'react';

const CatchGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const requestRef = useRef();

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const CATCHER_WIDTH = 100;
  const CATCHER_HEIGHT = 60;
  const CATCHER_Y = 520;

  const stateRef = useRef({
    catcherX: CANVAS_WIDTH / 2,
    items: [],
    particles: [],
    lastSpawn: 0,
    spawnRate: 1000, // ms
    combo: 0
  });

  const initGame = () => {
    stateRef.current = {
      catcherX: CANVAS_WIDTH / 2,
      items: [],
      particles: [],
      lastSpawn: 0,
      spawnRate: 1000,
      combo: 0
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

      if (typeRand < 0.3) {
        type = 'bad';
        char = config.badChar || '🐛';
        color = '#5D4037';
      } else if (typeRand < 0.4) {
        type = 'bonus';
        char = '🌟';
        color = '#FFD700';
      }

      stateRef.current.items.push({
        x: Math.random() * (CANVAS_WIDTH - 40) + 20,
        y: -50,
        speed: Math.random() * 2 + 2,
        type: type,
        char: char,
        color: color,
        w: 50,
        h: 50,
        rotation: 0,
        rotSpeed: (Math.random() - 0.5) * 0.1
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
    if (gameState !== 'playing') return;
    
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
      if (
        item.y + item.h > CATCHER_Y &&
        item.y < CATCHER_Y + CATCHER_HEIGHT &&
        item.x + item.w > state.catcherX - CATCHER_WIDTH / 2 &&
        item.x < state.catcherX + CATCHER_WIDTH / 2
      ) {
        // Catch!
        if (item.type === 'target') {
          const points = 10 + state.combo;
          onAddScore(points);
          setScore(s => s + points);
          state.combo++;
          createParticles(item.x, item.y, '#FF9F43', 8);
        } else if (item.type === 'bonus') {
          const points = 30;
          onAddScore(points);
          setScore(s => s + points);
          createParticles(item.x, item.y, '#FFD700', 15);
        } else {
          // Bad item
          const points = -10;
          onAddScore(points);
          setScore(s => Math.max(0, s + points));
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
    if (score >= 100) {
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
    
    ctx.fillStyle = '#8D6E63'; // Wood color
    // Basket body
    ctx.beginPath();
    ctx.moveTo(cx - CATCHER_WIDTH/2, cy);
    ctx.lineTo(cx + CATCHER_WIDTH/2, cy);
    ctx.lineTo(cx + CATCHER_WIDTH/2 - 10, cy + CATCHER_HEIGHT);
    ctx.lineTo(cx - CATCHER_WIDTH/2 + 10, cy + CATCHER_HEIGHT);
    ctx.fill();
    // Weave pattern
    ctx.strokeStyle = '#5D4037';
    ctx.lineWidth = 2;
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx - CATCHER_WIDTH/2 + 5, cy + 15);
    ctx.lineTo(cx + CATCHER_WIDTH/2 - 5, cy + 15);
    ctx.stroke();
    
    // Items
    state.items.forEach(item => {
      ctx.save();
      ctx.translate(item.x + item.w/2, item.y + item.h/2);
      ctx.rotate(item.rotation);
      ctx.fillStyle = item.color;
      
      if (item.type === 'bonus') {
        // Draw Star
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.char, 0, 0);
      } else if (item.type === 'bad') {
        // Draw Bad char
        ctx.font = "40px Arial";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.char, 0, 0);
      } else {
        // Draw Target char bubble
        ctx.beginPath();
        ctx.arc(0, 0, 25, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = 'white';
        ctx.font = "bold 30px serif";
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(item.char, 0, 2);
      }
      ctx.restore();
    });

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
    ctx.fillText(`スコア: ${score} / 100`, 20, 40);
    
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
    stateRef.current.catcherX = Math.max(CATCHER_WIDTH/2, Math.min(CANVAS_WIDTH - CATCHER_WIDTH/2, canvasX));
  };

  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const canvasX = (relativeX / rect.width) * CANVAS_WIDTH;
    stateRef.current.catcherX = Math.max(CATCHER_WIDTH/2, Math.min(CANVAS_WIDTH - CATCHER_WIDTH/2, canvasX));
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
  }, [gameState, score]); // Score dep needed for win check? Actually update closes over stateRef, but setGameState triggers re-render

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
