import React, { useState, useEffect, useRef } from 'react';

const JumpGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, won, lost
  const requestRef = useRef();

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -12;
  const MOVE_SPEED = 3.5; // Reduced speed
  const GROUND_Y = 500;
  const PLAYER_SIZE = 40;

  const stateRef = useRef({
    player: { x: 100, y: GROUND_Y - PLAYER_SIZE, vy: 0, grounded: true },
    cameraX: 0,
    score: 0,
    lives: 3,
    invincible: 0,
    enemies: [],
    obstacles: [],
    coins: [],
    clouds: [],
    particles: []
  });

  const initGame = () => {
    // Level Generation
    const enemies = [];
    const obstacles = [];
    const coins = [];
    const clouds = [];
    
    // Background Clouds
    for(let i=0; i<20; i++) {
        clouds.push({
            x: Math.random() * 6000,
            y: Math.random() * 300,
            size: 30 + Math.random() * 50,
            speed: 0.2 + Math.random() * 0.3
        });
    }

    // Simple Level Pattern
    let currentX = 800;
    const levelLength = 5000; 

    while (currentX < levelLength) {
      const type = Math.random();
      // Increased spacing for easier gameplay
      if (type < 0.25) {
        // Enemy
        enemies.push({
          x: currentX,
          y: GROUND_Y - 40,
          w: 40,
          h: 40,
          active: true,
          type: 'enemy'
        });
        if (Math.random() > 0.5) {
            coins.push({ x: currentX, y: GROUND_Y - 150, w: 30, h: 30, active: true });
        }
        currentX += 400;
      } else if (type < 0.5) {
        // Block (Platform)
        obstacles.push({
          x: currentX,
          y: GROUND_Y - 60,
          w: 60,
          h: 60,
          type: 'block'
        });
        coins.push({ x: currentX + 15, y: GROUND_Y - 100, w: 30, h: 30, active: true });
        currentX += 500;
      } else if (type < 0.7) {
        // Spike (Damage)
        obstacles.push({
          x: currentX,
          y: GROUND_Y - 40,
          w: 40,
          h: 40,
          type: 'spike'
        });
        currentX += 400;
      } else if (type < 0.85) {
        // Wall (Blocking, must jump)
        obstacles.push({
          x: currentX,
          y: GROUND_Y - 100,
          w: 40,
          h: 100,
          type: 'wall'
        });
        currentX += 400;
      } else {
        // Gap / Coin trail
        coins.push({ x: currentX, y: GROUND_Y - 80, w: 30, h: 30, active: true });
        coins.push({ x: currentX + 50, y: GROUND_Y - 80, w: 30, h: 30, active: true });
        currentX += 300;
      }
    }

    // Add Goal
    obstacles.push({
      x: levelLength,
      y: GROUND_Y - 200,
      w: 20,
      h: 200,
      type: 'goal'
    });

    stateRef.current = {
      player: { x: 100, y: GROUND_Y - PLAYER_SIZE, vy: 0, grounded: true },
      cameraX: 0,
      score: 0,
      lives: 3,
      invincible: 0,
      enemies: enemies,
      obstacles: obstacles,
      coins: coins,
      clouds: clouds,
      particles: []
    };
  };

  const jump = () => {
    const { player } = stateRef.current;
    if (player.grounded) {
      player.vy = JUMP_STRENGTH;
      player.grounded = false;
    }
  };

  const update = () => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const { player } = state;

    // 1. Player Movement (Auto Run)
    let intendedMove = MOVE_SPEED;
    
    // Invincibility
    if (state.invincible > 0) state.invincible--;

    // 2. Physics
    player.vy += GRAVITY;
    player.y += player.vy;

    // Ground Collision
    if (player.y + PLAYER_SIZE >= GROUND_Y) {
      player.y = GROUND_Y - PLAYER_SIZE;
      player.vy = 0;
      player.grounded = true;
    }

    // 3. Interactions
    // Check Goal
    const goal = state.obstacles.find(o => o.type === 'goal');
    if (goal) {
        // Win if passed or touching
        if (player.x > goal.x || rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, goal.x, goal.y, goal.w, goal.h)) {
            setGameState('won');
            onComplete(true);
            return;
        }
    }

    // Obstacles Collision
    state.obstacles.forEach(obs => {
      if (obs.type === 'goal') return;

      if (rectIntersect(player.x + intendedMove, player.y, PLAYER_SIZE, PLAYER_SIZE, obs.x, obs.y, obs.w, obs.h)) {
        if (obs.type === 'spike') {
            // Spike: Damage
            if (state.invincible <= 0) {
                state.lives--;
                state.invincible = 60; // 1 sec invincibility
                if (state.lives <= 0) setGameState('lost');
            }
        } else {
            // Block/Wall: Solid
            // Check collision direction
            // If falling onto it
            if (player.y + PLAYER_SIZE - player.vy <= obs.y) {
                player.y = obs.y - PLAYER_SIZE;
                player.vy = 0;
                player.grounded = true;
            } else {
                // Side collision -> Stop
                intendedMove = 0;
                // Align to wall
                if (player.x + PLAYER_SIZE < obs.x + 10) {
                    player.x = obs.x - PLAYER_SIZE - 1;
                }
            }
        }
      }
    });
    
    // Apply movement
    player.x += intendedMove;
    state.cameraX = player.x - 200;

    // Enemy Collision
    state.enemies.forEach(enemy => {
      if (!enemy.active) return;
      
      if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, enemy.x, enemy.y, enemy.w, enemy.h)) {
        // Stomp check: Falling and above enemy center
        if (player.vy > 0 && player.y + PLAYER_SIZE < enemy.y + enemy.h / 2) {
          // Kill enemy
          enemy.active = false;
          player.vy = JUMP_STRENGTH * 0.7; // Bounce higher
          onAddScore(100);
          state.score += 100; 
          // Spawn particles
          for(let i=0; i<8; i++) {
            state.particles.push({
              x: enemy.x + enemy.w/2, y: enemy.y + enemy.h/2, 
              vx: (Math.random() - 0.5) * 15, vy: (Math.random() - 0.5) * 15,
              color: '#8844ff',
              life: 30
            });
          }
        } else {
          // Hurt player
          if (state.invincible <= 0) {
              state.lives--;
              state.invincible = 60;
              if (state.lives <= 0) setGameState('lost');
          }
        }
      }
    });

    // Coin Collection
    state.coins.forEach(coin => {
        if (!coin.active) return;
        if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, coin.x, coin.y, coin.w, coin.h)) {
            coin.active = false;
            onAddScore(50);
            state.score += 50;
            // Coin sparkle
            for(let i=0; i<4; i++) {
                state.particles.push({
                  x: coin.x + coin.w/2, y: coin.y + coin.h/2, 
                  vx: (Math.random() - 0.5) * 10, vy: (Math.random() - 0.5) * 10,
                  color: '#FFD700',
                  life: 20
                });
            }
        }
    });

    // Update particles
    state.particles = state.particles.filter(p => p.life > 0);
    state.particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life--;
    });

    // Draw
    draw(ctx, state);
    requestRef.current = requestAnimationFrame(update);
  };

  const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
  };

  const draw = (ctx, state) => {
    // Ensure identity matrix for clearRect to prevent trails if restore failed
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    ctx.save();
    ctx.translate(-state.cameraX, 0);

    // Draw Background
    ctx.fillStyle = config.bg || '#87CEEB';
    ctx.fillRect(state.cameraX, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
    state.clouds.forEach(cloud => {
        // Parallax effect: cloud moves relative to camera but slower
        const parallaxX = cloud.x - (state.cameraX * cloud.speed); 
        // Loop clouds if needed or just draw long enough
        ctx.beginPath();
        ctx.arc(state.cameraX + parallaxX % (CANVAS_WIDTH * 2) + 100, cloud.y, cloud.size, 0, Math.PI * 2);
        ctx.arc(state.cameraX + parallaxX % (CANVAS_WIDTH * 2) + 100 + cloud.size*0.8, cloud.y + 10, cloud.size*0.7, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Ground
    ctx.fillStyle = '#654321';
    ctx.fillRect(state.cameraX, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
    // Grass Pattern
    ctx.fillStyle = '#4CAF50';
    ctx.fillRect(state.cameraX, GROUND_Y, CANVAS_WIDTH, 20);
    for(let i=0; i<CANVAS_WIDTH/20; i++) {
        ctx.fillStyle = '#388E3C';
        ctx.beginPath();
        ctx.moveTo(state.cameraX + i*40, GROUND_Y);
        ctx.lineTo(state.cameraX + i*40 + 20, GROUND_Y + 10);
        ctx.lineTo(state.cameraX + i*40 + 40, GROUND_Y);
        ctx.fill();
    }

    // Draw Goal
    const goal = state.obstacles.find(o => o.type === 'goal');
    if (goal) {
      ctx.fillStyle = '#ddd'; // Pole
      ctx.fillRect(goal.x, goal.y, 10, 200);
      ctx.fillStyle = '#FFD700'; // Knob
      ctx.beginPath(); ctx.arc(goal.x+5, goal.y, 10, 0, Math.PI*2); ctx.fill();
      
      ctx.fillStyle = '#ff4757'; // Flag
      ctx.beginPath();
      ctx.moveTo(goal.x + 10, goal.y + 10);
      ctx.lineTo(goal.x + 80, goal.y + 40);
      ctx.lineTo(goal.x + 10, goal.y + 70);
      ctx.fill();
      // Draw Target Char
      ctx.font = "bold 40px 'Zen Maru Gothic'";
      ctx.fillStyle = "white";
      ctx.fillText(config.targetChar || '★', goal.x + 25, goal.y + 55);
    }

    // Draw Obstacles
    state.obstacles.forEach(obs => {
      if (obs.type === 'block' || obs.type === 'wall') {
        // Block/Wall
        ctx.fillStyle = obs.type === 'wall' ? '#795548' : '#8D6E63'; 
        ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
        // Border
        ctx.strokeStyle = '#5D4037';
        ctx.lineWidth = 2;
        ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        if (obs.type === 'block') {
            // Question mark dots
            ctx.fillStyle = '#5D4037';
            ctx.fillRect(obs.x + 10, obs.y + 10, 5, 5);
            ctx.fillRect(obs.x + obs.w - 15, obs.y + 10, 5, 5);
            ctx.fillRect(obs.x + 10, obs.y + obs.h - 15, 5, 5);
            ctx.fillRect(obs.x + obs.w - 15, obs.y + obs.h - 15, 5, 5);
        }
      } else if (obs.type === 'spike') {
        // Spike
        ctx.fillStyle = '#D32F2F';
        ctx.beginPath();
        ctx.moveTo(obs.x, obs.y + obs.h);
        ctx.lineTo(obs.x + obs.w/2, obs.y);
        ctx.lineTo(obs.x + obs.w, obs.y + obs.h);
        ctx.fill();
      }
    });

    // Draw Coins
    state.coins.forEach(coin => {
        if (!coin.active) return;
        const wobble = Math.sin(Date.now() / 200) * 5;
        ctx.fillStyle = '#FFD700';
        ctx.beginPath();
        ctx.arc(coin.x + coin.w/2, coin.y + coin.h/2 + wobble, coin.w/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#FFF176';
        ctx.beginPath();
        ctx.arc(coin.x + coin.w/2, coin.y + coin.h/2 + wobble, coin.w/3, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Enemies (Slimes)
    state.enemies.forEach(enemy => {
      if (enemy.active) {
        const bounce = Math.abs(Math.sin(Date.now() / 150)) * 5;
        ctx.fillStyle = '#9C27B0'; // Purple slime
        ctx.beginPath();
        // Slime shape (semi-circle + rectangle bottom)
        ctx.arc(enemy.x + enemy.w/2, enemy.y + enemy.h/2 + bounce, enemy.w/2, Math.PI, 0);
        ctx.rect(enemy.x, enemy.y + enemy.h/2 + bounce, enemy.w, enemy.h/2 - bounce);
        ctx.fill();
        // Eyes
        ctx.fillStyle = 'white';
        ctx.beginPath(); ctx.arc(enemy.x + 10, enemy.y + 15 + bounce, 5, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(enemy.x + 30, enemy.y + 15 + bounce, 5, 0, Math.PI*2); ctx.fill();
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(enemy.x + 12, enemy.y + 15 + bounce, 2, 0, Math.PI*2); ctx.fill();
        ctx.beginPath(); ctx.arc(enemy.x + 28, enemy.y + 15 + bounce, 2, 0, Math.PI*2); ctx.fill();
      }
    });

    // Draw Particles
    state.particles.forEach(p => {
      ctx.fillStyle = p.color || "orange";
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(0, p.life/4), 0, Math.PI*2);
      ctx.fill();
    });

    // Draw Player
    const px = state.player.x;
    const py = state.player.y;
    
    // Blink if invincible
    if (state.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
        // Skip drawing
    } else {
        // Body
        ctx.fillStyle = '#FF9F43';
        ctx.beginPath();
        ctx.ellipse(px + 20, py + 20, 15, 20, 0, 0, Math.PI * 2);
        ctx.fill();
        
        // Legs (Running Animation)
        const time = Date.now() / 100;
        const legOffset1 = Math.sin(time) * 10;
        const legOffset2 = Math.sin(time + Math.PI) * 10;
        
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 4;
        ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 20 + legOffset1, py + 50); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 20 + legOffset2, py + 50); ctx.stroke();

        // Head band / Hat
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(px + 5, py + 5, 30, 8);
        
        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(px + 28, py + 15, 3, 0, Math.PI*2); ctx.fill();
    }

    ctx.restore();

    // UI Overlay
    ctx.font = "20px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "right";
    ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH - 20, 40);
    
    // Draw Hearts
    ctx.textAlign = "left";
    let hearts = "";
    for(let i=0; i<state.lives; i++) hearts += "❤ ";
    ctx.fillStyle = "#ff4757";
    ctx.fillText(hearts, 20, 40);
  };

  const handleInput = (e) => {
    if (e.type === 'mousedown' || e.type === 'touchstart') {
      if (gameState === 'playing') {
        jump();
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    canvas.width = CANVAS_WIDTH;
    canvas.height = CANVAS_HEIGHT;
    initGame();
    if(canvas) {
       draw(canvas.getContext('2d'), stateRef.current);
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
    <div className="game-area jump-game" style={{ background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || '漢字ラン'}</h3>
          <p>{config.instruction || 'タップでジャンプ！ゴールを目指そう！'}</p>
          <button className="start-btn" onClick={() => setGameState('playing')}>スタート！</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ざんねん...</h2>
          <p>ぶつかっちゃった！</p>
          <button className="start-btn" onClick={() => {
            initGame();
            setGameState('playing');
          }}>リトライ</button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: '#87CEEB', touchAction: 'none' }}
        onMouseDown={handleInput}
        onTouchStart={handleInput}
      />
    </div>
  );
};

export default JumpGame;
