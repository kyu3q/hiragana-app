import React, { useState, useEffect, useRef } from 'react';
import { GRADE1_KANJI, SIMILAR_PAIRS } from '../../../data/kanjiData';
import { playJumpSound, playOK1Sound, playNGSound, playHappy1Sound, playHappy2Sound, playFinishSound } from '../../../utils/soundPlayer';

const JumpGame = ({ config, onComplete, onAddScore }) => {
  const canvasRef = useRef(null);
  const [gameState, setGameState] = useState('start'); // start, playing, won, lost
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [gameOverReason, setGameOverReason] = useState('');
  const requestRef = useRef();

  // Constants
  const CANVAS_WIDTH = 800;
  const CANVAS_HEIGHT = 600;
  const GRAVITY = 0.6;
  const JUMP_STRENGTH = -13;
  const MOVE_SPEED = 3.5;
  const GROUND_Y = 500;
  const PLAYER_SIZE = 40;
  
  // Game State Reference to avoid closure staleness in game loop
  const stateRef = useRef({
    player: { x: 100, y: GROUND_Y - PLAYER_SIZE, vy: 0, grounded: true, jumpCount: 0 },
    cameraX: 0,
    score: 0,
    combo: 0,
    comboTimer: 0,
    lives: 3,
    invincible: 0,
    magnetTimer: 0,
    shield: false,
    items: [], 
    enemies: [],
    obstacles: [],
    clouds: [],
    mountains: [],
    particles: [],
    powerups: []
  });

  const initGame = () => {
    const items = [];
    const enemies = [];
    const obstacles = [];
    const clouds = [];
    const mountains = [];
    const powerups = [];
    
    // Background Elements
    // Clouds (Layer 1 - Slowest)
    for(let i=0; i<30; i++) {
        clouds.push({
            x: Math.random() * 8000,
            y: Math.random() * 200,
            size: 40 + Math.random() * 60,
            speed: 0.2 + Math.random() * 0.3
        });
    }
    // Mountains (Layer 2 - Medium)
    for(let i=0; i<40; i++) {
        mountains.push({
            x: i * 300 + Math.random() * 100,
            y: GROUND_Y,
            h: 150 + Math.random() * 200,
            w: 400 + Math.random() * 200,
            color: `hsl(${120 + Math.random()*40}, 30%, ${20 + Math.random()*20}%)`
        });
    }

    // Level Generation
    let currentX = 800;
    const levelLength = 10000; // Longer level
    let difficultyMultiplier = 1;

    while (currentX < levelLength) {
      const type = Math.random();
      
      // Determine Target Character vs Distractor
      const isTarget = Math.random() < 0.5;
      let char = config.targetChar;
      
      if (!isTarget) {
          let distractor = '';
          if (SIMILAR_PAIRS[config.targetChar]) {
              const similars = SIMILAR_PAIRS[config.targetChar];
              distractor = similars[Math.floor(Math.random() * similars.length)];
          }
          if (!distractor) {
              distractor = GRADE1_KANJI[Math.floor(Math.random() * GRADE1_KANJI.length)];
              if (distractor === config.targetChar) distractor = 'Ｘ';
          }
          char = distractor;
      }

      // Pattern Generation
      if (type < 0.2) {
        // --- Pattern: Upper Path (Sky Road) ---
        const pathLength = 4 + Math.floor(Math.random() * 5); // 4-8 blocks
        const pathHeight = 160;
        
        for(let i=0; i<pathLength; i++) {
             obstacles.push({
                x: currentX + i*80, y: GROUND_Y - pathHeight, w: 80, h: 40, type: 'block' // floating block
            });
            // Items on top
            if (i % 2 === 0) {
                 items.push({
                    x: currentX + i*80 + 20, y: GROUND_Y - pathHeight - 60,
                    w: 40, h: 40, char: char, type: isTarget ? 'target' : 'bad', active: true
                });
            }
        }
        
        // Maybe an enemy on the path
        if (pathLength > 5) {
             enemies.push({
                x: currentX + 160, y: GROUND_Y - pathHeight - 45, w: 45, h: 45, active: true, type: 'slime',
                patrolStart: currentX, patrolEnd: currentX + pathLength*80, vx: 1
            });
        }

        currentX += pathLength * 80 + 200;

      } else if (type < 0.4) {
        // --- Pattern: Ground Enemy & Item ---
        enemies.push({
            x: currentX, y: GROUND_Y - 45, w: 45, h: 45, active: true, type: 'slime',
            patrolStart: currentX, patrolEnd: currentX + 100, vx: 1
        });
        items.push({
            x: currentX + 50, y: GROUND_Y - 160,
            w: 40, h: 40, char: char, type: isTarget ? 'target' : 'bad', active: true
        });
        currentX += 450;
      } else if (type < 0.55) {
        // --- Pattern: Flying Enemy ---
        enemies.push({
            x: currentX, y: GROUND_Y - 100 - Math.random() * 100, w: 50, h: 40, active: true, type: 'bird',
            baseY: GROUND_Y - 150, phase: Math.random() * Math.PI * 2
        });
        currentX += 300;
      } else if (type < 0.7) {
        // --- Pattern: Step Blocks (Stairs) ---
        for(let i=0; i<3; i++) {
             obstacles.push({
                x: currentX + i*100, y: GROUND_Y - 80 - i*60, w: 80, h: 40, type: 'block'
            });
            items.push({
                x: currentX + i*100 + 20, y: GROUND_Y - 80 - i*60 - 60,
                w: 40, h: 40, char: char, type: isTarget ? 'target' : 'bad', active: true
            });
        }
        currentX += 400;

      } else if (type < 0.8) {
         // --- Pattern: Spikes ---
         obstacles.push({
            x: currentX, y: GROUND_Y - 40, w: 40, h: 40, type: 'spike'
        });
        currentX += 300;
      } else if (type < 0.9) {
        // --- Powerup Chance ---
        const r = Math.random();
        let pType = 'magnet';
        if (r < 0.3) pType = 'magnet';
        else if (r < 0.6) pType = 'shield';
        else pType = 'heart'; 

        powerups.push({
            x: currentX, y: GROUND_Y - 100, w: 40, h: 40, type: pType, active: true
        });
        currentX += 300;
      } else {
         // Empty gap
         currentX += 200;
      }
    }

    // Goal
    obstacles.push({
      x: levelLength,
      y: GROUND_Y - 250,
      w: 20,
      h: 250,
      type: 'goal'
    });

    stateRef.current = {
      player: { x: 100, y: GROUND_Y - PLAYER_SIZE, vy: 0, grounded: true, jumpCount: 0 },
      cameraX: 0,
      score: 0,
      combo: 0,
      comboTimer: 0,
      lives: 3,
      invincible: 0,
      magnetTimer: 0,
      shield: false,
      items, enemies, obstacles, clouds, mountains, particles: [], powerups
    };
    setScore(0);
    setCombo(0);
    setGameOverReason('');
  };

  // --- Actions ---
  const jump = () => {
    const { player } = stateRef.current;
    if (player.grounded || player.jumpCount < 2) {
      player.vy = JUMP_STRENGTH;
      player.grounded = false;
      player.jumpCount++;
      
      createParticles(player.x + PLAYER_SIZE/2, player.y + PLAYER_SIZE, 5, '#fff', 2);
      playJumpSound();
    }
  };

  const createParticles = (x, y, count, color, speed) => {
    for(let i=0; i<count; i++) {
        stateRef.current.particles.push({
            x, y,
            vx: (Math.random() - 0.5) * speed * 2,
            vy: (Math.random() - 0.5) * speed * 2,
            color,
            life: 20 + Math.random() * 20,
            size: Math.random() * 5 + 2
        });
    }
  };

  const addScore = (amount) => {
      const state = stateRef.current;
      
      // Combo Multiplier
      let multiplier = 1 + Math.floor(state.combo / 5) * 0.5; // Every 5 combo adds 0.5x
      const finalScore = Math.floor(amount * multiplier);
      
      state.score += finalScore;
      state.combo++;
      state.comboTimer = 180; // Reset combo timer (3 seconds at 60fps)
      
      setScore(state.score);
      setCombo(state.combo);
      onAddScore(finalScore);
      
      // Visual feedback
      createParticles(state.player.x, state.player.y - 50, 5, '#FFD700', 5);
  };

  const takeDamage = (reason) => {
      const state = stateRef.current;
      if (state.invincible > 0) return;
      
      if (state.shield) {
          state.shield = false;
          state.invincible = 60;
          createParticles(state.player.x + PLAYER_SIZE/2, state.player.y + PLAYER_SIZE/2, 10, '#00FFFF', 5);
          playNGSound(); // Softer sound maybe?
          return;
      }

      state.lives--;
      state.invincible = 90;
      state.combo = 0; // Reset combo on damage
      setCombo(0);
      playNGSound();
      
      if (state.lives <= 0) {
          setGameOverReason(reason);
          setGameState('lost');
      }
  };

  // --- Main Loop ---
  const update = () => {
    if (gameState !== 'playing') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    const state = stateRef.current;
    const { player } = state;

    // -- Timers --
    if (state.invincible > 0) state.invincible--;
    if (state.magnetTimer > 0) state.magnetTimer--;
    if (state.comboTimer > 0) {
        state.comboTimer--;
        if (state.comboTimer <= 0) {
            state.combo = 0; // Combo expired
            setCombo(0);
        }
    }

    // -- Player Physics --
    player.vy += GRAVITY;
    player.y += player.vy;
    let intendedMove = MOVE_SPEED;

    // Ground Collision
    if (player.y + PLAYER_SIZE >= GROUND_Y) {
      player.y = GROUND_Y - PLAYER_SIZE;
      player.vy = 0;
      player.grounded = true;
      player.jumpCount = 0;
    }

    // -- Interactions --
    
    // 1. Obstacles
    state.obstacles.forEach(obs => {
        if (obs.type === 'goal') {
             if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, obs.x, obs.y, obs.w, obs.h)) {
                playFinishSound();
                setGameState('won');
                onComplete(true);
            }
            return;
        }

        if (rectIntersect(player.x + intendedMove, player.y, PLAYER_SIZE, PLAYER_SIZE, obs.x, obs.y, obs.w, obs.h)) {
            if (obs.type === 'spike') {
                takeDamage('トゲに当たっちゃった！');
            } else if (obs.type === 'block') {
                // Top Collision
                if (player.vy >= 0 && player.y + PLAYER_SIZE - player.vy <= obs.y + 10) {
                    player.y = obs.y - PLAYER_SIZE;
                    player.vy = 0;
                    player.grounded = true;
                    player.jumpCount = 0;
                } else {
                    // Side Collision (Stop movement)
                    if (player.x + PLAYER_SIZE <= obs.x + 10) {
                        intendedMove = 0; 
                    }
                }
            }
        }
    });

    // Apply Movement
    player.x += intendedMove;
    state.cameraX = player.x - 150;
    if (player.y > CANVAS_HEIGHT) {
        setGameOverReason('落ちちゃった！');
        setGameState('lost');
        return;
    }

    // 2. Enemies
    state.enemies.forEach(enemy => {
        if (!enemy.active) return;
        
        // AI Movement
        if (enemy.type === 'slime') {
            enemy.x += enemy.vx || -1;
            if (enemy.x < enemy.patrolStart) enemy.vx = 1;
            if (enemy.x > enemy.patrolEnd) enemy.vx = -1;
        } else if (enemy.type === 'bird') {
            enemy.x -= 2; // Fly left
            enemy.y = enemy.baseY + Math.sin(Date.now() / 200 + enemy.phase) * 50;
        }

        // Collision
        if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, enemy.x, enemy.y, enemy.w, enemy.h)) {
            // Stomp logic (only if falling and player bottom is above enemy center)
            if (player.vy > 0 && player.y + PLAYER_SIZE < enemy.y + enemy.h * 0.8) {
                enemy.active = false;
                player.vy = JUMP_STRENGTH * 0.8; 
                addScore(50);
                playHappy1Sound();
                createParticles(enemy.x + enemy.w/2, enemy.y + enemy.h/2, 10, '#9C27B0', 4);
            } else {
                takeDamage('敵に当たっちゃった！');
            }
        }
    });

    // 3. Powerups
    state.powerups.forEach(p => {
        if (!p.active) return;
        if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, p.x, p.y, p.w, p.h)) {
            p.active = false;
            if (p.type === 'magnet') {
                state.magnetTimer = 600; // 10 seconds
                createParticles(p.x, p.y, 10, 'red', 5);
                playHappy2Sound();
            } else if (p.type === 'shield') {
                state.shield = true;
                createParticles(p.x, p.y, 10, 'cyan', 5);
                playHappy2Sound();
            } else if (p.type === 'heart') {
                state.lives = Math.min(state.lives + 1, 5); // Max 5 lives
                createParticles(p.x, p.y, 10, '#ff4757', 5);
                playHappy2Sound();
            }
        }
    });

    // 4. Items (Kanji)
    state.items.forEach(item => {
        if (!item.active) return;
        
        // Magnet Effect
        if (state.magnetTimer > 0 && item.type === 'target') {
            const dx = player.x - item.x;
            const dy = player.y - item.y;
            const dist = Math.sqrt(dx*dx + dy*dy);
            if (dist < 300) {
                item.x += dx * 0.1;
                item.y += dy * 0.1;
            }
        }

        if (rectIntersect(player.x, player.y, PLAYER_SIZE, PLAYER_SIZE, item.x, item.y, item.w, item.h)) {
            item.active = false;
            if (item.type === 'target') {
                addScore(100);
                playOK1Sound();
                createParticles(item.x, item.y, 8, '#FFD700', 3);
            } else {
                takeDamage('間違った漢字を取っちゃった！');
            }
        }
    });

    // 5. Particles
    state.particles = state.particles.filter(p => p.life > 0);
    state.particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life--;
        p.vy += 0.1; // gravity for particles
    });

    draw(ctx, state);
    requestRef.current = requestAnimationFrame(update);
  };

  // --- Rendering ---
  const draw = (ctx, state) => {
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);
    
    // Sky Gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, CANVAS_HEIGHT);
    gradient.addColorStop(0, '#4FC3F7'); // Light Blue
    gradient.addColorStop(1, '#E1F5FE'); // White-ish Blue
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, CANVAS_WIDTH, CANVAS_HEIGHT);

    ctx.save();
    
    // Parallax Backgrounds
    // 1. Mountains (Slow)
    ctx.translate(-state.cameraX * 0.2, 0);
    state.mountains.forEach(m => {
        // Simple culling for performance (optional but good practice)
        if (m.x - state.cameraX * 0.2 > -500 && m.x - state.cameraX * 0.2 < CANVAS_WIDTH + 500) {
            ctx.fillStyle = m.color;
            ctx.beginPath();
            ctx.moveTo(m.x, m.y);
            ctx.lineTo(m.x + m.w/2, m.y - m.h);
            ctx.lineTo(m.x + m.w, m.y);
            ctx.fill();
        }
    });
    ctx.restore();

    ctx.save();
    // 2. Clouds (Medium Slow)
    ctx.translate(-state.cameraX * 0.5, 0);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
    state.clouds.forEach(c => {
        const lx = c.x % (CANVAS_WIDTH * 4); // Loop clouds
        ctx.beginPath();
        ctx.arc(lx, c.y, c.size, 0, Math.PI * 2);
        ctx.arc(lx + c.size*0.7, c.y + c.size*0.3, c.size*0.8, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();

    // Game World
    ctx.save();
    ctx.translate(-state.cameraX, 0);

    // Ground
    ctx.fillStyle = '#795548';
    ctx.fillRect(state.cameraX, GROUND_Y, CANVAS_WIDTH, CANVAS_HEIGHT - GROUND_Y);
    // Grass Top
    ctx.fillStyle = '#8BC34A';
    ctx.fillRect(state.cameraX, GROUND_Y, CANVAS_WIDTH, 20);
    
    // Decorate Ground (simple patterns)
    ctx.fillStyle = '#689F38';
    for(let i=Math.floor(state.cameraX/100)*100; i<state.cameraX+CANVAS_WIDTH; i+=100) {
        ctx.beginPath(); ctx.arc(i, GROUND_Y, 10, 0, Math.PI, true); ctx.fill();
    }

    // Goal
    const goal = state.obstacles.find(o => o.type === 'goal');
    if (goal) {
        ctx.fillStyle = '#FFD700';
        ctx.fillRect(goal.x, goal.y, 10, 250); // Pole
        // Flag
        ctx.fillStyle = '#FF5252';
        ctx.beginPath();
        ctx.moveTo(goal.x + 10, goal.y + 10);
        ctx.lineTo(goal.x + 100, goal.y + 40);
        ctx.lineTo(goal.x + 10, goal.y + 70);
        ctx.fill();
        // Target Char on Flag
        ctx.fillStyle = 'white';
        ctx.font = 'bold 40px sans-serif';
        ctx.fillText(config.targetChar, goal.x + 20, goal.y + 50);
    }

    // Obstacles
    state.obstacles.forEach(obs => {
        if (obs.type === 'block') {
            // Bright Orange/Brown for visibility
            ctx.fillStyle = '#FFB74D'; 
            ctx.fillRect(obs.x, obs.y, obs.w, obs.h);
            
            // Cute pattern (dots)
            ctx.fillStyle = '#FFF3E0';
            ctx.beginPath(); ctx.arc(obs.x+10, obs.y+10, 5, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(obs.x+obs.w-10, obs.y+10, 5, 0, Math.PI*2); ctx.fill();
            
            ctx.strokeStyle = '#EF6C00'; ctx.lineWidth = 3;
            ctx.strokeRect(obs.x, obs.y, obs.w, obs.h);
        } else if (obs.type === 'spike') {
            // Bright Red Spikes
            ctx.fillStyle = '#FF5252';
            for(let i=0; i<3; i++) {
                ctx.beginPath();
                ctx.moveTo(obs.x + (i*obs.w/3), obs.y + obs.h);
                ctx.lineTo(obs.x + (i*obs.w/3) + obs.w/6, obs.y);
                ctx.lineTo(obs.x + ((i+1)*obs.w/3), obs.y + obs.h);
                ctx.fill();
            }
            ctx.strokeStyle = 'white'; ctx.lineWidth = 1;
            ctx.stroke(); // Outline
        }
    });

    // Powerups
    state.powerups.forEach(p => {
        if (!p.active) return;
        const bob = Math.sin(Date.now() / 200) * 5;
        ctx.font = '30px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        
        // Glow effect
        ctx.shadowColor = 'white';
        ctx.shadowBlur = 10;
        
        if (p.type === 'magnet') {
            ctx.fillText('🧲', p.x + p.w/2, p.y + p.h/2 + bob);
        } else if (p.type === 'shield') {
            ctx.fillText('🛡️', p.x + p.w/2, p.y + p.h/2 + bob);
        } else if (p.type === 'heart') {
            // Bright Pink Heart
            ctx.fillStyle = '#FF4081'; 
            ctx.font = '35px sans-serif';
            ctx.fillText('❤', p.x + p.w/2, p.y + p.h/2 + bob);
        }
        ctx.shadowBlur = 0; // Reset
    });

    // Enemies
    state.enemies.forEach(e => {
        if (!e.active) return;
        if (e.type === 'slime') {
            const squish = Math.abs(Math.sin(Date.now() / 150)) * 0.1;
            ctx.fillStyle = '#AB47BC';
            ctx.beginPath();
            ctx.ellipse(e.x + e.w/2, e.y + e.h * 0.8, e.w/2 * (1+squish), e.h/2 * (1-squish), 0, Math.PI, 0);
            ctx.fill();
            // Eyes
            ctx.fillStyle = 'white';
            ctx.beginPath(); ctx.arc(e.x + 15, e.y + 25, 6, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(e.x + 35, e.y + 25, 6, 0, Math.PI*2); ctx.fill();
            ctx.fillStyle = 'black';
            ctx.beginPath(); ctx.arc(e.x + 15, e.y + 25, 2, 0, Math.PI*2); ctx.fill();
            ctx.beginPath(); ctx.arc(e.x + 35, e.y + 25, 2, 0, Math.PI*2); ctx.fill();
        } else if (e.type === 'bird') {
            ctx.fillStyle = '#EF5350';
            ctx.beginPath();
            ctx.ellipse(e.x + e.w/2, e.y + e.h/2, e.w/2, e.h/3, 0, 0, Math.PI*2);
            ctx.fill();
            // Wings
            const wingY = Math.sin(Date.now()/100) * 10;
            ctx.fillStyle = '#E57373';
            ctx.beginPath(); ctx.moveTo(e.x + 20, e.y + 20); ctx.lineTo(e.x - 10, e.y + 5 + wingY); ctx.lineTo(e.x + 20, e.y + 10); ctx.fill();
            // Beak
            ctx.fillStyle = '#FFEB3B';
            ctx.beginPath(); ctx.moveTo(e.x, e.y + 20); ctx.lineTo(e.x - 10, e.y + 25); ctx.lineTo(e.x, e.y + 30); ctx.fill();
        }
    });

    // Items
    state.items.forEach(item => {
        if (!item.active) return;
        const bob = Math.sin(Date.now() / 300) * 5;
        
        ctx.fillStyle = item.type === 'target' ? '#FFF59D' : '#E0E0E0';
        ctx.beginPath();
        ctx.arc(item.x + item.w/2, item.y + item.h/2 + bob, item.w/2 + 2, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.strokeStyle = item.type === 'target' ? '#FBC02D' : '#9E9E9E';
        ctx.lineWidth = 3;
        ctx.stroke();

        ctx.font = `bold ${item.w * 0.7}px "Zen Maru Gothic", serif`;
        ctx.fillStyle = item.type === 'target' ? '#F57F17' : '#616161';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(item.char, item.x + item.w/2, item.y + item.h/2 + bob + 2); // +2 for baseline adjustment
    });

    // Particles
    state.particles.forEach(p => {
        ctx.globalAlpha = p.life / 20;
        ctx.fillStyle = p.color;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.globalAlpha = 1.0;
    });

    // Player
    const px = state.player.x;
    const py = state.player.y;
    
    if (state.invincible > 0 && Math.floor(Date.now() / 50) % 2 === 0) {
        // Blink
    } else {
        // Shield Effect
        if (state.shield) {
            ctx.strokeStyle = '#00E5FF';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(px + 20, py + 20, 30, 0, Math.PI*2);
            ctx.stroke();
            ctx.fillStyle = 'rgba(0, 229, 255, 0.2)';
            ctx.fill();
        }
        
        // Magnet Effect Visual
        if (state.magnetTimer > 0) {
            ctx.strokeStyle = '#FF1744';
            ctx.lineWidth = 1;
            ctx.beginPath(); ctx.arc(px + 20, py + 20, 200, 0, Math.PI*2); ctx.stroke(); // Range indicator (faint)
        }

        // Body (Original Style)
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
        // Adjust legs based on grounded
        if (!state.player.grounded) {
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 10, py + 45); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 30, py + 50); ctx.stroke();
        } else {
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 20 + legOffset1, py + 50); ctx.stroke();
             ctx.beginPath(); ctx.moveTo(px + 20, py + 35); ctx.lineTo(px + 20 + legOffset2, py + 50); ctx.stroke();
        }

        // Head band
        ctx.fillStyle = '#4ECDC4';
        ctx.fillRect(px + 5, py + 5, 30, 8);
        
        // Eyes
        ctx.fillStyle = 'black';
        ctx.beginPath(); ctx.arc(px + 28, py + 15, 3, 0, Math.PI*2); ctx.fill();
    }

    ctx.restore();

    // -- UI Overlay --
    ctx.font = "bold 24px Arial";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "white";
    
    // Score
    ctx.textAlign = "right";
    ctx.fillText(`スコア: ${state.score}`, CANVAS_WIDTH - 20, 40);
    
    // Combo
    if (state.combo > 1) {
        ctx.fillStyle = "#FFD700";
        ctx.font = "bold 28px Arial";
        ctx.fillText(`${state.combo} COMBO!`, CANVAS_WIDTH - 20, 80);
        ctx.font = "20px Arial";
        ctx.fillText(`x${(1 + Math.floor(state.combo/5)*0.5).toFixed(1)}`, CANVAS_WIDTH - 20, 105);
    }
    
    // Lives
    ctx.textAlign = "left";
    ctx.fillStyle = "#ff4757";
    ctx.font = "24px Arial";
    let hearts = "";
    for(let i=0; i<state.lives; i++) hearts += "❤ ";
    ctx.fillText(hearts, 20, 40);

    // Buffs
    let buffY = 80;
    if (state.shield) {
        ctx.fillStyle = '#00E5FF';
        ctx.fillText("🛡️ シールド", 20, buffY);
        buffY += 30;
    }
    if (state.magnetTimer > 0) {
        ctx.fillStyle = '#FF1744';
        ctx.fillText(`🧲 マグネット (${Math.ceil(state.magnetTimer/60)})`, 20, buffY);
    }
    
    // Target display
    ctx.shadowBlur = 0;
    ctx.fillStyle = "rgba(0,0,0,0.5)";
    ctx.fillRect(CANVAS_WIDTH/2 - 70, 10, 140, 50);
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.font = "20px Arial";
    ctx.fillText(`ターゲット`, CANVAS_WIDTH/2, 30);
    ctx.font = "bold 28px 'Zen Maru Gothic'";
    ctx.fillText(config.targetChar, CANVAS_WIDTH/2, 55);
  };

  const rectIntersect = (x1, y1, w1, h1, x2, y2, w2, h2) => {
    return x2 < x1 + w1 && x2 + w2 > x1 && y2 < y1 + h1 && y2 + h2 > y1;
  };

  const handleInput = (e) => {
    if (gameState === 'playing') {
       jump();
    }
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
    <div className="game-area jump-game" style={{ background: '#333', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
       {gameState === 'start' && (
        <div className="game-instruction-overlay">
          <h3>{config.title || '漢字ランナー'}</h3>
          <p>{config.instruction || '正しい漢字を集めてゴールを目指せ！'}</p>
          
          <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px', margin:'20px 0', textAlign:'left', background:'rgba(255,255,255,0.1)', padding:'15px', borderRadius:'8px'}}>
             <div>
                <span style={{fontSize:'24px'}}>🎯 {config.targetChar}</span> <br/>
                <small>正解（コンボをつなげ！）</small>
             </div>
             <div>
                <span style={{fontSize:'24px'}}>❌ 漢字</span> <br/>
                <small>間違い（ダメージ）</small>
             </div>
             <div>
                <span style={{fontSize:'24px'}}>🧲</span> <br/>
                <small>漢字をすいよせる</small>
             </div>
             <div>
                <span style={{fontSize:'24px'}}>🛡️</span> <br/>
                <small>1回だけ守ってくれる</small>
             </div>
             <div>
                <span style={{fontSize:'24px'}}>❤</span> <br/>
                <small>ライフ回復</small>
             </div>
          </div>

          <p style={{fontSize: '0.9em'}}>画面タップでジャンプ（2回まで可能）</p>
          <p style={{fontSize: '0.9em', color:'#FFD700'}}>敵を踏んづけて倒せるよ！</p>
          <button className="start-btn" onClick={() => {
              initGame();
              setGameState('playing');
          }}>スタート！</button>
        </div>
      )}

      {gameState === 'lost' && (
        <div className="game-result-modal">
          <h2>ゲームオーバー</h2>
          <p>{gameOverReason}</p>
          <div style={{fontSize:'2rem', margin:'10px 0'}}>
             スコア: {score}
          </div>
          <button className="start-btn" onClick={() => {
            initGame();
            setGameState('playing');
          }}>リトライ</button>
        </div>
      )}
      
      <canvas 
        ref={canvasRef}
        style={{ width: '100%', height: '100%', maxWidth: '800px', maxHeight: '600px', aspectRatio: '4/3', border: '2px solid #ddd', borderRadius: '8px', background: '#000', touchAction: 'none' }}
        onMouseDown={handleInput}
        onTouchStart={handleInput}
      />
    </div>
  );
};

export default JumpGame;
