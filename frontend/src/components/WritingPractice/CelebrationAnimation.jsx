import React, { useEffect, useRef } from 'react';
import './CelebrationAnimation.css';

const CelebrationAnimation = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let animationFrameId;
    let particles = [];

    // キャンバスのサイズ設定
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };

    // パーティクルのクラス
    class Particle {
      constructor(x, y) {
        this.x = x;
        this.y = y;
        this.size = Math.random() * 8 + 3;
        this.speedX = Math.random() * 8 - 4;
        this.speedY = Math.random() * 8 - 4;
        this.color = `hsl(${Math.random() * 360}, 70%, 60%)`;
      }

      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        this.size -= 0.15;
      }

      draw() {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    // パーティクルの生成
    const createParticles = () => {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      for (let i = 0; i < 100; i++) {
        particles.push(new Particle(centerX, centerY));
      }
    };

    // アニメーションの更新
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      for (let i = particles.length - 1; i >= 0; i--) {
        particles[i].update();
        particles[i].draw();

        if (particles[i].size <= 0) {
          particles.splice(i, 1);
        }
      }

      if (particles.length > 0) {
        animationFrameId = requestAnimationFrame(animate);
      }
    };

    // 初期化
    resizeCanvas();
    createParticles();
    animate();

    // リサイズイベントのリスナー
    window.addEventListener('resize', resizeCanvas);

    // クリーンアップ
    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <div className="celebration-container">
      <canvas ref={canvasRef} className="celebration-canvas" />
      <div className="celebration-text">よくできました！</div>
    </div>
  );
};

export default CelebrationAnimation; 