import React, { useState, useEffect, useRef } from 'react';
import { playJumpSound, playOK1Sound, playNGSound, playHappy1Sound, playFinishSound } from '../../../utils/soundPlayer';

const AirplaneGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, won, lost
  const requestRef = useRef();

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.4;
  const THRUST = -0.8;
  const MAX_SPEED = 8;
  const SCROLL_SPEED = 4;
  const PLAYER_SIZE = 50;

  const stateRef = useRef({
    player: { x: 100, y: CANVAS_HEIGHT / 2, vy: 0, angle: 0 },
    items: [], // {x, y, type, char, w, h}
    particles: [],
    clouds: [],
    score: 0,
    fuel: 100,
    distance: 0,
    isThrusting: false,
    combo: 0,
    invincible: 0,
    levelLength: 3000 // Distance to fly to win
  });

  const initGame = () => {
    // Generate initial clouds
    const clouds = [];
    for(let i=0; i<10; i++) {
        clouds.push({
            x: Math.random() * CANVAS_WIDTH,
            y: Math.random() * CANVAS_HEIGHT,
            size: 40 + Math.random() * 60,
            speed: 0.5 + Math.random() * 1.5
        });
    }

    stateRef.current = {
      player: { x: 100, y: CANVAS_HEIGHT / 2, vy: 0, angle: 0 },
      items: [],
      particles: [],
      clouds: clouds,
      score: 0,
      fuel: 100,
      distance: 0,
      isThrusting: false,
      combo: 0,
      invincible: 0,
      levelLength: 3000
    };
  };

  const spawnItem = () => {
    const state = stateRef.current;
    const typeRoll = Math.random();
    
    let item = {
        x: CANVAS_WIDTH + 50,
        y: 50 + Math.random() * (CANVAS_HEIGHT - 100),
        w: 50,
        h: 50,
        vx: -SCROLL_SPEED
    };

    // 50% Good Kanji (Fuel + Score) - Increased from 40%
    // 25% Bad Kanji (Damage)
    // 15% Obstacle (Bird/Storm)
    // 10% Coin (Bonus)

    if (typeRoll < 0.5) {
        item.type = 'good';
        item.char = config.targetChar || '○';
        item.color = '#4CAF50';
    } else if (typeRoll < 0.75) {
        item.type = 'bad';
        item.char = config.badChar || '×';
        item.color = '#F44336';
    } else if (typeRoll < 0.9) {
        item.type = 'obstacle';
        item.subType = Math.random() > 0.5 ? 'bird' : 'storm';
        item.w = 60;
        item.h = 40;
    } else {
        item.type = 'coin';
        item.w = 30;
        item.h = 30;
    }

    state.items.push(item);
  };

  const update = () => {
    if (gameState !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const { player } = state;

    // 0. Invincibility
    if (state.invincible > 0) state.invincible--;

    // 1. Physics
    if (state.isThrusting) {
        player.vy += THRUST;
    } else {
        player.vy += GRAVITY;
    }

    // Limit speed
    player.vy = Math.max(Math.min(player.vy, MAX_SPEED), -MAX_SPEED);
    
    player.y += player.vy;
    
    // Angle based on velocity
    player.angle = Math.min(Math.PI / 4, Math.max(-Math.PI / 4, (player.vy * 0.1)));

    // Boundaries
    if (player.y < 0) { player.y = 0; player.vy = 0; }
    if (player.y > CANVAS_HEIGHT - PLAYER_SIZE) { 
        player.y = CANVAS_HEIGHT - PLAYER_SIZE; 
        player.vy = 0; 
        // Hitting ground damage?
        if (state.invincible <= 0) {
            state.fuel -= 0.5;
        }
    }

    // 2. Game Progress
    state.distance += SCROLL_SPEED / 10;
    state.fuel -= 0.02; // Reduced constant fuel drain from 0.05

    // Win Condition
    if (state.distance >= state.levelLength) {
        setGameState('won');
        onComplete(true);
        playFinishSound();
        return;
    }

    // Lose Condition
    if (state.fuel <= 0) {
        setGameState('lost');
        playNGSound();
        return;
    }

    // 3. Spawning
    if (Math.random() < 0.02) {
        spawnItem();
    }
    // Cloud spawning
    if (Math.random() < 0.01) {
        state.clouds.push({
            x: CANVAS_WIDTH + 100,
            y: Math.random() * CANVAS_HEIGHT,
            size: 40 + Math.random() * 60,
            speed: 0.5 + Math.random() * 1.5
        });
    }

    // 4. Updates & Collisions
    // Update Items
    state.items.forEach(item => {
        item.x += item.vx;
        // Sine wave movement for birds
        if (item.type === 'obstacle' && item.subType === 'bird') {
            item.y += Math.sin(Date.now() / 200) * 2;
        }
    });

    // Check Collisions
    state.items = state.items.filter(item => {
        // Off screen
        if (item.x + item.w < -100) return false;

        // Collision with player
        if (rectIntersect(player.x, player.y + 10, PLAYER_SIZE, PLAYER_SIZE - 20, item.x, item.y, item.w, item.h)) {
            // handleCollision returns true if item should be removed
            return !handleCollision(item, state);
        }
        return true;
    });

    // Update Clouds
    state.clouds.forEach(c => c.x -= c.speed);
    state.clouds = state.clouds.filter(c => c.x + c.size > -100);

    // Update Particles
    state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.1; // gravity
    });
    state.particles = state.particles.filter(p => p.life > 0);

    // Draw
    draw(ctx, state);
    requestRef.current = requestAnimationFrame(update);
  };

  const handleCollision = (item, state) => {
    if (item.type === 'good') {
        // Correct Kanji
        playHappy1Sound();
        state.score += 100;
        state.fuel = Math.min(100, state.fuel + 20); // Increased recovery
        state.combo++;
        onAddScore(100);
        createParticles(item.x, item.y, '#4CAF50', 10);
        return true; // remove item
    } else if (item.type === 'coin') {
        playOK1Sound();
        state.score += 50;
        onAddScore(50);
        createParticles(item.x, item.y, '#FFD700', 5);
        return true; // remove item
    } else {
        // Bad things (Bad Kanji, Obstacle)
        if (state.invincible <= 0) {
            playNGSound();
            state.score = Math.max(0, state.score - 50);
            state.fuel -= 10; // Reduced damage
            state.combo = 0;
            state.player.vy = 5; // Knockback down
            state.invincible = 60; // 1 second invincibility
            createParticles(item.x, item.y, '#555', 8);
            return true; // remove item only if hit (to prevent multi-hit?) 
            // Actually usually obstacles don't disappear in some games but in this case let's make them disappear to avoid multi-hit confusion
        }
        return false; // Don't remove if invincible (pass through)
    }
  };

  const createParticles = (x, y, color, count) => {
    for(let i=0; i<count; i++) {
        stateRef.current.particles.push({
            x: x, y: y,
            vx: (Math.random() - 0.5) * 10,
            vy: (Math.random() - 0.5) * 10,
            life: 30,
            color: color
        });
    }
  };

  const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
  };

  const draw = (ctx, state) => {
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Sky Background
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#4FC3F7');
    gradient.addColorStop(1, '#E1F5FE');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    // Draw Clouds
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    state.clouds.forEach(c => {
        ctx.beginPath();
        ctx.arc(c.x, c.y, c.size, 0, Math.PI * 2);
        ctx.arc(c.x + c.size * 0.5, c.y - c.size * 0.2, c.size * 0.8, 0, Math.PI * 2);
        ctx.arc(c.x - c.size * 0.5, c.y - c.size * 0.2, c.size * 0.8, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Goal Line (if close)
    const remaining = state.levelLength - state.distance;
    if (remaining < CANVAS_WIDTH) {
        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
        ctx.fillRect(remaining + 200, 0, 50, CANVAS_HEIGHT); // Finish line visual
        // Checkered pattern
        for(let i=0; i<CANVAS_HEIGHT; i+=50) {
            ctx.fillStyle = (i/50)%2===0 ? 'black' : 'white';
            ctx.fillRect(remaining + 200, i, 20, 50);
        }
    }

    // Draw Items
    state.items.forEach(item => {
        if (item.type === 'good' || item.type === 'bad') {
            // Circle background
            ctx.fillStyle = item.type === 'good' ? '#81C784' : '#E57373';
            ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/2, 0, Math.PI * 2);
            ctx.fill();
            // Ring
            ctx.strokeStyle = 'white';
            ctx.lineWidth = 3;
            ctx.stroke();
            // Text
            ctx.fillStyle = 'white';
            ctx.font = "bold 30px 'Zen Maru Gothic', sans-serif";
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(item.char, item.x + item.w/2, item.y + item.h/2);
        } else if (item.type === 'coin') {
            ctx.fillStyle = '#FFD700';
            ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#FFF59D';
            ctx.beginPath();
            ctx.arc(item.x + item.w/2, item.y + item.h/2, item.w/3, 0, Math.PI * 2);
            ctx.fill();
        } else if (item.type === 'obstacle') {
            if (item.subType === 'bird') {
                // Bird
                ctx.fillStyle = '#5D4037';
                ctx.beginPath();
                ctx.moveTo(item.x, item.y + item.h/2);
                ctx.quadraticCurveTo(item.x + item.w/4, item.y, item.x + item.w/2, item.y + item.h/2);
                ctx.quadraticCurveTo(item.x + item.w*3/4, item.y, item.x + item.w, item.y + item.h/2);
                ctx.lineTo(item.x + item.w/2, item.y + item.h);
                ctx.fill();
                // Wing
                ctx.fillStyle = '#8D6E63';
                ctx.beginPath();
                ctx.ellipse(item.x + item.w/2, item.y + item.h/2, 10, 5, 0, 0, Math.PI*2);
                ctx.fill();
            } else {
                // Storm
                ctx.fillStyle = '#78909C';
                ctx.beginPath();
                ctx.arc(item.x + 20, item.y + 20, 20, 0, Math.PI * 2);
                ctx.arc(item.x + 40, item.y + 15, 25, 0, Math.PI * 2);
                ctx.arc(item.x + 10, item.y + 25, 15, 0, Math.PI * 2);
                ctx.fill();
                // Lightning
                if (Math.random() < 0.2) {
                    ctx.strokeStyle = '#FFEB3B';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(item.x + 20, item.y + 30);
                    ctx.lineTo(item.x + 10, item.y + 50);
                    ctx.lineTo(item.x + 30, item.y + 45);
                    ctx.lineTo(item.x + 20, item.y + 65);
                    ctx.stroke();
                }
            }
        }
    });

    // Draw Particles
    state.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.life / 5, 0, Math.PI * 2);
        ctx.fill();
    });

    // Draw Player (Airplane)
    ctx.save();
    ctx.translate(state.player.x + PLAYER_SIZE/2, state.player.y + PLAYER_SIZE/2);
    ctx.rotate(state.player.angle);
    
    // Invincibility Blink
    if (state.invincible > 0 && Math.floor(Date.now() / 100) % 2 === 0) {
        ctx.globalAlpha = 0.5;
    }

    // Body
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.ellipse(0, 0, 30, 15, 0, 0, Math.PI*2);
    ctx.fill();
    // Tail
    ctx.beginPath();
    ctx.moveTo(-25, -5);
    ctx.lineTo(-35, -20);
    ctx.lineTo(-30, 0);
    ctx.fill();
    // Wing
    ctx.fillStyle = '#FF8A80';
    ctx.beginPath();
    ctx.ellipse(5, 5, 20, 8, 0.5, 0, Math.PI*2);
    ctx.fill();
    ctx.fillStyle = '#D32F2F'; // Propeller
    ctx.fillRect(25, -15, 5, 30);
    // Cockpit
    ctx.fillStyle = '#E0F7FA';
    ctx.beginPath();
    ctx.arc(10, -5, 8, 0, Math.PI, true);
    ctx.fill();

    ctx.restore();
    ctx.globalAlpha = 1.0;

    // UI Overlay
    // Fuel Bar
    ctx.fillStyle = 'rgba(0,0,0,0.5)';
    ctx.fillRect(20, 20, 200, 20);
    ctx.fillStyle = state.fuel > 30 ? '#76FF03' : '#FF1744';
    ctx.fillRect(22, 22, 196 * (state.fuel / 100), 16);
    ctx.fillStyle = 'white';
    ctx.font = '14px Arial';
    ctx.fillText("FUEL", 25, 35);

    // Score
    ctx.fillStyle = 'white';
    ctx.font = '24px Arial';
    ctx.textAlign = 'right';
    ctx.fillText(`Score: ${state.score}`, CANVAS_WIDTH - 20, 40);

    // Progress
    const progress = Math.min(1, state.distance / state.levelLength);
    ctx.fillStyle = 'rgba(0,0,0,0.3)';
    ctx.fillRect(CANVAS_WIDTH/2 - 100, 20, 200, 10);
    ctx.fillStyle = '#FFC107';
    ctx.fillRect(CANVAS_WIDTH/2 - 100, 20, 200 * progress, 10);
    // Icon on progress bar
    ctx.fillStyle = '#FF5252';
    ctx.beginPath();
    ctx.arc(CANVAS_WIDTH/2 - 100 + 200 * progress, 25, 8, 0, Math.PI*2);
    ctx.fill();

  };

  const handleInputStart = (e) => {
    e.preventDefault();
    if (gameState === 'playing') {
        stateRef.current.isThrusting = true;
        playJumpSound(); // Use jump sound as engine rev
    }
  };

  const handleInputEnd = (e) => {
    e.preventDefault();
    stateRef.current.isThrusting = false;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
        canvas.width = CANVAS_WIDTH;
        canvas.height = CANVAS_HEIGHT;
        initGame();
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
    <div className="game-area airplane-game" style={{ background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || '空の旅'}</h3>
          <p>{config.instruction || '画面を押して上昇！燃料（漢字）を集めて飛び続けよう！'}</p>
          <div className="instruction-icons" style={{display:'flex', gap:'20px', justifyContent:'center', margin:'10px 0'}}>
             <div style={{textAlign:'center'}}>
                <div style={{width:'30px', height:'30px', background:'#4CAF50', borderRadius:'50%', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>{config.targetChar}</div>
                <small>正解</small>
             </div>
             <div style={{textAlign:'center'}}>
                <div style={{width:'30px', height:'30px', background:'#F44336', borderRadius:'50%', margin:'0 auto', display:'flex', alignItems:'center', justifyContent:'center', color:'white'}}>{config.badChar}</div>
                <small>ハズレ</small>
             </div>
          </div>
          <button className="start-btn" onClick={() => setGameState('playing')}>フライト開始！</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>墜落...</h2>
          <p>燃料がなくなっちゃった！</p>
          <p>Score: {stateRef.current.score}</p>
          <button className="start-btn" onClick={() => {
            initGame();
            setGameState('playing');
          }}>リトライ</button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: '#4FC3F7', touchAction: 'none' }}
        onMouseDown={handleInputStart}
        onMouseUp={handleInputEnd}
        onMouseLeave={handleInputEnd}
        onTouchStart={handleInputStart}
        onTouchEnd={handleInputEnd}
      />
    </div>
  );
};

export default AirplaneGame;
