import React, { useState, useEffect, useRef } from 'react';
import { GRADE1_KANJI, SIMILAR_PAIRS } from '../../data/kanjiData';
import { playOK2Sound, playNGSound, playHappy1Sound } from '../../utils/soundPlayer';

const SnakeGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start');
  const [score, setScore] = useState(0);
  const requestRef = useRef();
  const lastUpdateRef = useRef(0);
  const badItemTimerRef = useRef(0);

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRID_SIZE = 40;
  const COLS = CANVAS_WIDTH / GRID_SIZE;
  const ROWS = CANVAS_HEIGHT / GRID_SIZE;
  
  // Dynamic speed based on score - slower start (250ms), speeds up by 10ms every 50 points, capped at 100ms
  const getSpeed = (currentScore) => Math.max(100, 250 - Math.floor(currentScore / 50) * 10);

  const stateRef = useRef({
    snake: [{ x: 5, y: 5 }, { x: 4, y: 5 }, { x: 3, y: 5 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    items: [], // { x, y, char, type }
    score: 0
  });

  const initGame = () => {
    stateRef.current = {
      snake: [{ x: Math.floor(COLS/2), y: Math.floor(ROWS/2) }],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      items: [],
      score: 0
    };
    badItemTimerRef.current = Date.now();
    setScore(0);
    spawnItem('target');
    spawnItem('bad');
  };

  const spawnItem = (type) => {
    let x, y, valid;
    const { snake, items } = stateRef.current;
    
    // Try to find empty spot
    for (let i = 0; i < 50; i++) {
        x = Math.floor(Math.random() * COLS);
        y = Math.floor(Math.random() * ROWS);
        valid = true;
        
        // Check collision with snake
        for (let segment of snake) {
            if (segment.x === x && segment.y === y) {
                valid = false;
                break;
            }
        }
        // Check collision with other items
        if (valid) {
            for (let item of items) {
                if (item.x === x && item.y === y) {
                    valid = false;
                    break;
                }
            }
        }
        if (valid) break;
    }

    if (valid) {
        let char = config.targetChar;
        if (type === 'bad') {
            // Pick distractor
            const target = config.targetChar;
            let distractor = '';
            if (SIMILAR_PAIRS[target]) {
                const similars = SIMILAR_PAIRS[target];
                distractor = similars[Math.floor(Math.random() * similars.length)];
            }
            if (!distractor) {
                distractor = GRADE1_KANJI[Math.floor(Math.random() * GRADE1_KANJI.length)];
                if (distractor === target) distractor = 'Ｘ';
            }
            char = distractor;
        }
        
        stateRef.current.items.push({ x, y, char, type, spawnedAt: Date.now() });
    }
  };

  const update = (timestamp) => {
    if (gameState !== 'playing') return;

    const currentSpeed = getSpeed(stateRef.current.score);

    if (timestamp - lastUpdateRef.current > currentSpeed) {
        const state = stateRef.current;
        state.direction = state.nextDirection;
        
        // Move
        const head = { 
            x: state.snake[0].x + state.direction.x, 
            y: state.snake[0].y + state.direction.y 
        };

        // Wall Collision
        if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS) {
            playNGSound();
            setGameState('lost');
            return;
        }

        // Self Collision
        for (let segment of state.snake) {
            if (head.x === segment.x && head.y === segment.y) {
                playNGSound();
                setGameState('lost');
                return;
            }
        }

        // Item Collision
        let ate = false;
        let hitBad = false;
        const newItems = state.items.filter(item => {
            if (item.x === head.x && item.y === head.y) {
                if (item.type === 'target') {
                    ate = true;
                    playOK2Sound();
                    onAddScore(50);
                    state.score += 50;
                    setScore(state.score);
                } else {
                    hitBad = true;
                }
                return false; // Remove eaten item
            }
            return true;
        });
        state.items = newItems;

        if (hitBad) {
            playNGSound();
            setGameState('lost');
            return;
        }

        state.snake.unshift(head);
        if (!ate) {
            state.snake.pop();
        } else {
            // Spawn new target
            spawnItem('target');
            // Maybe spawn bad?
            if (Math.random() > 0.5) spawnItem('bad');
        }
        
        // Bad item rotation (disappear every 3s)
        // Check existing bad items
        const now = Date.now();
        if (now - badItemTimerRef.current > 3000) {
            // Remove all bad items and spawn new ones
            state.items = state.items.filter(i => i.type === 'target');
            // Spawn 1-3 bad items
            const count = 1 + Math.floor(Math.random() * 3);
            for(let i=0; i<count; i++) spawnItem('bad');
            badItemTimerRef.current = now;
        }

        // Win condition
        if (state.score >= 500) {
             playHappy1Sound();
             setGameState('won');
             onComplete(true);
             return;
        }

        lastUpdateRef.current = timestamp;
    }

    draw();
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;

    // Clear
    ctx.fillStyle = config.bg || '#f0f9ff'; // Match BlockGame/CatchGame atmosphere
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Grid
    ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    ctx.lineWidth = 1;
    ctx.setLineDash([2, 2]); // Dotted grid
    for(let i=0; i<=COLS; i++) {
        ctx.beginPath(); ctx.moveTo(i*GRID_SIZE, 0); ctx.lineTo(i*GRID_SIZE, CANVAS_HEIGHT); ctx.stroke();
    }
    for(let i=0; i<=ROWS; i++) {
        ctx.beginPath(); ctx.moveTo(0, i*GRID_SIZE); ctx.lineTo(CANVAS_WIDTH, i*GRID_SIZE); ctx.stroke();
    }
    ctx.setLineDash([]); // Reset dash

    // Draw Snake
    // Body
    ctx.fillStyle = '#8BC34A';
    for (let i = 1; i < state.snake.length; i++) {
        const segment = state.snake[i];
        ctx.beginPath();
        ctx.arc(segment.x * GRID_SIZE + GRID_SIZE/2, segment.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2 - 2, 0, Math.PI*2);
        ctx.fill();
    }

    // Head
    const head = state.snake[0];
    ctx.fillStyle = '#FF9F43';
    
    // Draw Head Background
    ctx.beginPath();
    ctx.arc(head.x * GRID_SIZE + GRID_SIZE/2, head.y * GRID_SIZE + GRID_SIZE/2, GRID_SIZE/2, 0, Math.PI*2);
    ctx.fill();

    // Draw Eyes to show direction
    const eyeOffset = GRID_SIZE * 0.2;
    const eyeSize = GRID_SIZE * 0.1;
    ctx.fillStyle = 'white';
    
    let leftEyeX = head.x * GRID_SIZE + GRID_SIZE/2 - eyeOffset;
    let leftEyeY = head.y * GRID_SIZE + GRID_SIZE/2 - eyeOffset;
    let rightEyeX = head.x * GRID_SIZE + GRID_SIZE/2 + eyeOffset;
    let rightEyeY = head.y * GRID_SIZE + GRID_SIZE/2 - eyeOffset;

    // Adjust eye position based on direction
    if (state.direction.x === 1) { // Right
        leftEyeX += eyeOffset; rightEyeX += eyeOffset;
    } else if (state.direction.x === -1) { // Left
        leftEyeX -= eyeOffset; rightEyeX -= eyeOffset;
    } else if (state.direction.y === 1) { // Down
        leftEyeY += eyeOffset; rightEyeY += eyeOffset;
    } else if (state.direction.y === -1) { // Up
        leftEyeY -= eyeOffset; rightEyeY -= eyeOffset;
    }

    ctx.beginPath(); ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI*2); ctx.fill();
    
    // Draw Pupils
    ctx.fillStyle = 'black';
    ctx.beginPath(); ctx.arc(leftEyeX, leftEyeY, eyeSize/2, 0, Math.PI*2); ctx.fill();
    ctx.beginPath(); ctx.arc(rightEyeX, rightEyeY, eyeSize/2, 0, Math.PI*2); ctx.fill();

    // Draw Items
    state.items.forEach(item => {
        ctx.font = `bold ${GRID_SIZE - 5}px serif`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Unified color for all items to force reading
        ctx.fillStyle = '#5D4037';
        ctx.fillText(item.char, item.x * GRID_SIZE + GRID_SIZE/2, item.y * GRID_SIZE + GRID_SIZE/2);
    });
  };

  const handleKeyDown = (e) => {
    const state = stateRef.current;
    // Prevent default scrolling for arrow keys
    if(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
    }
    
    switch(e.key) {
        case 'ArrowUp': if (state.direction.y === 0) state.nextDirection = { x: 0, y: -1 }; break;
        case 'ArrowDown': if (state.direction.y === 0) state.nextDirection = { x: 0, y: 1 }; break;
        case 'ArrowLeft': if (state.direction.x === 0) state.nextDirection = { x: -1, y: 0 }; break;
        case 'ArrowRight': if (state.direction.x === 0) state.nextDirection = { x: 1, y: 0 }; break;
    }
  };

  // Touch controls (Swipe)
  const touchStartRef = useRef({ x: 0, y: 0 });
  
  const handleTouchStart = (e) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };

  const handleTouchEnd = (e) => {
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    const state = stateRef.current;

    if (Math.abs(dx) > Math.abs(dy)) {
        if (Math.abs(dx) > 30) { // Threshold
            if (dx > 0 && state.direction.x === 0) state.nextDirection = { x: 1, y: 0 };
            else if (dx < 0 && state.direction.x === 0) state.nextDirection = { x: -1, y: 0 };
        }
    } else {
        if (Math.abs(dy) > 30) {
            if (dy > 0 && state.direction.y === 0) state.nextDirection = { x: 0, y: 1 };
            else if (dy < 0 && state.direction.y === 0) state.nextDirection = { x: 0, y: -1 };
        }
    }
  };

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if(canvas) {
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        draw();
    }
    initGame();
    return () => cancelAnimationFrame(requestRef.current);
  }, [config]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  const togglePause = () => {
      if (gameState === 'playing') setGameState('paused');
      else if (gameState === 'paused') setGameState('playing');
  };

  return (
    <div className="game-area snake-game" style={{ background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center', touchAction: 'none', position: 'relative' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || '漢字スネーク'}</h3>
          <p>{config.instruction || '正しい漢字を食べて長くなろう！'}</p>
          <button className="start-btn" onClick={() => {
              initGame();
              setGameState('playing');
          }}>スタート！</button>
        </div>
      )}

      {gameState === 'paused' && (
        <div className="game-instruction-overlay">
          <h3>一時停止</h3>
          <button className="start-btn" onClick={() => setGameState('playing')}>再開</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ゲームオーバー</h2>
          <p>間違った漢字を食べたか、壁にぶつかりました。</p>
          <button className="start-btn" onClick={() => {
            initGame();
            setGameState('playing');
          }}>リトライ</button>
        </div>
      )}

      {gameState === 'playing' && (
          <button 
            style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'rgba(255,255,255,0.8)',
                border: 'none',
                borderRadius: '50%',
                width: '40px',
                height: '40px',
                fontSize: '20px',
                cursor: 'pointer',
                zIndex: 20
            }}
            onClick={togglePause}
          >
            ⏸
          </button>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: config.bg || '#f0f9ff' }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      />
      
      {/* Mobile Controls Overlay (Optional, but swipe is implemented) */}
    </div>
  );
};

export default SnakeGame;
