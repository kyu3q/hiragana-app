import React from 'react';

// 雲は、大きさ・濃さ・速さの違う3層で流す（CSS の .scene-cloud.far / .mid / .near）
const Cloud = ({ layer, top, delay }) => (
  <svg
    className={`scene-cloud ${layer}`}
    style={{ top, animationDelay: delay }}
    viewBox="-50 -42 100 62"
  >
    <ellipse cx="0" cy="0" rx="46" ry="17" fill="#fff" />
    <circle cx="-18" cy="-12" r="17" fill="#fff" />
    <circle cx="8" cy="-18" r="21" fill="#fff" />
    <circle cx="28" cy="-8" r="14" fill="#fff" />
  </svg>
);

const STARS = [
  [60, 70, 2.4, '0s'], [150, 120, 1.8, '-0.8s'], [250, 60, 2.6, '-1.5s'], [340, 140, 2, '-0.3s'],
  [380, 60, 1.6, '-1s'], [100, 190, 1.8, '-0.4s'], [300, 220, 2.2, '-2s'], [30, 250, 1.6, '-1.2s'],
];

// マップの高さに依存しない背景。親（position: relative）いっぱいに広がる。
const AdventureScene = () => (
  <div className="adventure-scene" aria-hidden="true">
    <div className="scene-sky" />

    {/* 上端: 月と星 */}
    <svg className="scene-stars" viewBox="0 0 420 300">
      <circle cx="330" cy="100" r="26" fill="#fff8d6" />
      <circle cx="341" cy="93" r="23" fill="#4a4a9c" opacity="0.35" />
      {STARS.map(([cx, cy, r, delay]) => (
        <circle key={`${cx}-${cy}`} className="scene-star" cx={cx} cy={cy} r={r} fill="#fff" style={{ animationDelay: delay }} />
      ))}
    </svg>

    <div className="scene-sun" />

    <Cloud layer="far" top="12%" delay="-10s" />
    <Cloud layer="mid" top="30%" delay="-30s" />
    <Cloud layer="near" top="52%" delay="-5s" />
    <Cloud layer="mid" top="70%" delay="-45s" />

    {/* 下端: 山・丘・草原・木・花 */}
    <svg className="scene-ground" viewBox="0 -40 420 460">
      <defs>
        <linearGradient id="sceneGrass" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#9ad98a" />
          <stop offset="1" stopColor="#6cc06a" />
        </linearGradient>
        <g id="sceneTree">
          <rect x="-4" y="0" width="8" height="26" rx="3" fill="#a1745a" />
          <circle cx="0" cy="-8" r="22" fill="#5fb878" />
          <circle cx="-14" cy="4" r="15" fill="#6cc784" />
          <circle cx="14" cy="4" r="15" fill="#6cc784" />
        </g>
        <g id="sceneFlower">
          <circle r="5" fill="#ffd1dc" />
          <circle cx="6" cy="-4" r="5" fill="#ffd1dc" />
          <circle cx="-6" cy="-4" r="5" fill="#ffd1dc" />
          <circle cy="-8" r="5" fill="#ffd1dc" />
          <circle cy="-4" r="3.5" fill="#ffd54f" />
        </g>
      </defs>

      <path d="M-20 190 L80 60 Q95 40 110 60 L210 190Z" fill="#b9c8f0" />
      <path d="M60 190 L190 0 Q210 -30 230 0 L360 190Z" fill="#a9b9e6" />
      <path d="M165 22 L190 0 Q210 -30 230 0 L252 30 Q235 18 222 32 Q210 16 196 32 Q182 20 165 22Z" fill="#fff" />
      <path d="M250 190 L340 80 Q355 62 370 80 L460 190Z" fill="#b3c3ec" />
      <path d="M-20 240 Q90 140 200 210 Q300 150 440 230 L440 420 L-20 420Z" fill="#a6dc9a" />
      <path d="M-20 290 Q110 240 230 280 Q330 310 440 260 L440 420 L-20 420Z" fill="url(#sceneGrass)" />

      <use href="#sceneTree" x="40" y="350" />
      <use href="#sceneTree" x="380" y="330" />
      <use href="#sceneTree" x="350" y="380" transform="translate(70 76) scale(0.8)" />
      <use href="#sceneFlower" x="130" y="375" />
      <use href="#sceneFlower" x="270" y="390" />
      <use href="#sceneFlower" x="60" y="400" />
      <use href="#sceneFlower" x="330" y="360" />
    </svg>
  </div>
);

export default AdventureScene;
