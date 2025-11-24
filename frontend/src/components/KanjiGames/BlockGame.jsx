import React, { useState, useEffect, useRef } from 'react';

const BlockGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [gameState, setGameState] = useState('start'); // start, playing, won, lost
  const requestRef = useRef();

  // Game Constants
  const PADDLE_WIDTH = 100;
  const PADDLE_HEIGHT = 15;
  const BALL_RADIUS = 8;
  const BRICK_ROW_COUNT = 4;
  const BRICK_COLUMN_COUNT = 6;
  
  // State refs for animation loop
  const stateRef = useRef({
    paddleX: 0,
    ball: { x: 0, y: 0, dx: 0, dy: 0 },
    bricks: [],
    score: 0
  });

  const initGame = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const width = canvas.width;
    const height = canvas.height;

    // Create Bricks
    const bricks = [];
    const brickWidth = (width - 40) / BRICK_COLUMN_COUNT;
    const brickHeight = 25;
    const padding = 5;
    const offsetTop = 50;
    const offsetLeft = 20;

    for (let c = 0; c < BRICK_COLUMN_COUNT; c++) {
      for (let r = 0; r < BRICK_ROW_COUNT; r++) {
        bricks.push({
          x: (c * (brickWidth + padding)) + offsetLeft,
          y: (r * (brickHeight + padding)) + offsetTop,
          width: brickWidth,
          height: brickHeight,
          status: 1, // 1 = active
          color: `hsl(${c * 60}, 70%, 60%)`
        });
      }
    }

    stateRef.current = {
      paddleX: (width - PADDLE_WIDTH) / 2,
      ball: { x: width / 2, y: height - 30, dx: 4, dy: -4 },
      bricks: bricks,
      score: 0
    };
  };

  const update = () => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const width = canvas.width;
    const height = canvas.height;
    const state = stateRef.current;
    
    // Move Paddle
    // (Controlled by mouse handler updating state directly or via ref)
    
    // Move Ball
    state.ball.x += state.ball.dx;
    state.ball.y += state.ball.dy;

    // Wall Collision
    if (state.ball.x + state.ball.dx > width - BALL_RADIUS || state.ball.x + state.ball.dx < BALL_RADIUS) {
      state.ball.dx = -state.ball.dx;
    }
    if (state.ball.y + state.ball.dy < BALL_RADIUS) {
      state.ball.dy = -state.ball.dy;
    } else if (state.ball.y + state.ball.dy > height - BALL_RADIUS) {
      // Paddle Collision check
      if (state.ball.x > state.paddleX && state.ball.x < state.paddleX + PADDLE_WIDTH) {
        state.ball.dy = -state.ball.dy;
        // Add a bit of speed or angle change?
      } else {
        // Game Over - but let's just reset ball for kids or endless mode
        state.ball.dy = -state.ball.dy; // Bounce off bottom for "easy mode"? 
        // Or maybe lose points?
        onAddScore(-5);
      }
    }

    // Brick Collision
    let activeBricks = 0;
    state.bricks.forEach(b => {
      if (b.status === 1) {
        activeBricks++;
        if (
          state.ball.x > b.x &&
          state.ball.x < b.x + b.width &&
          state.ball.y > b.y &&
          state.ball.y < b.y + b.height
        ) {
          state.ball.dy = -state.ball.dy;
          b.status = 0;
          onAddScore(10);
          state.score += 10;
        }
      }
    });

    if (activeBricks === 0) {
      setGameState('won');
      onComplete(true);
      return;
    }

    // Draw
    draw(ctx, width, height, state);
    
    requestRef.current = requestAnimationFrame(update);
  };

  const draw = (ctx, width, height, state) => {
    ctx.clearRect(0, 0, width, height);

    // Draw Bricks
    state.bricks.forEach(b => {
      if (b.status === 1) {
        ctx.beginPath();
        ctx.rect(b.x, b.y, b.width, b.height);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.closePath();
      }
    });

    // Draw Paddle
    ctx.beginPath();
    ctx.rect(state.paddleX, height - PADDLE_HEIGHT, PADDLE_WIDTH, PADDLE_HEIGHT);
    ctx.fillStyle = "#FF9F43";
    ctx.fill();
    ctx.closePath();

    // Draw Ball
    ctx.beginPath();
    ctx.arc(state.ball.x, state.ball.y, BALL_RADIUS, 0, Math.PI * 2);
    ctx.fillStyle = "#333";
    ctx.fill();
    ctx.closePath();
    
    // Draw Kanji in background?
    ctx.font = "200px serif";
    ctx.fillStyle = "rgba(0,0,0,0.05)";
    ctx.textAlign = "center";
    ctx.fillText(config.targetChar || '', width / 2, height / 2 + 50);
  };

  const handleMouseMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.clientX - rect.left;
    const canvasX = (relativeX / rect.width) * canvas.width; // Scale if CSS size differs
    
    if (canvasX > 0 && canvasX < canvas.width) {
      stateRef.current.paddleX = canvasX - PADDLE_WIDTH / 2;
    }
  };
  
  const handleTouchMove = (e) => {
    e.preventDefault();
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const relativeX = e.touches[0].clientX - rect.left;
    const canvasX = (relativeX / rect.width) * canvas.width;
    
    if (canvasX > 0 && canvasX < canvas.width) {
      stateRef.current.paddleX = canvasX - PADDLE_WIDTH / 2;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    // Set logical size matches display?
    canvas.width = 600;
    canvas.height = 400;
    
    initGame();
    
    // Initial Draw
    if(canvas) {
       draw(canvas.getContext('2d'), 600, 400, stateRef.current);
    }
    
    return () => cancelAnimationFrame(requestRef.current);
  }, [config]);

  useEffect(() => {
    if (gameState === 'playing') {
      requestRef.current = requestAnimationFrame(update);
    }
    return () => cancelAnimationFrame(requestRef.current);
  }, [gameState]);

  return (
    <div className="game-area block-game" style={{ background: '#f0f9ff', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || 'ブロック崩し'}</h3>
          <p>{config.instruction || 'ブロックをくずして漢字を完成させよう！'}</p>
          <button className="start-btn" onClick={() => {
            setGameState('playing');
          }}>スタート！</button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', maxWidth: '600px', height: 'auto', aspectRatio: '3/2', border: '2px solid #ddd', borderRadius: '8px', background: 'white' }}
        onMouseMove={handleMouseMove}
        onTouchMove={handleTouchMove}
      />
    </div>
  );
};

export default BlockGame;
