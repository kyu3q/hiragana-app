# かな冒険クイズ 背景・シーン改善 設計と実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** かな冒険クイズの背景とマップを、やさしい絵本風の見た目に改善する（登るほど昼 → 夕焼け → 星空に変わる）。

**Architecture:** 背景を `AdventureScene.jsx` に切り出す。画像ファイルは使わず、空は CSS グラデーション、山・草原・星は SVG、雲と太陽は CSS で描く。マップの高さ（再出題で増減する）に依存しない作りにする。道は、ステージの位置から計算する滑らかな曲線（`pathGeometry.js` の純粋関数）で描く。

**Tech Stack:** React 18 / SVG / CSS / Vitest 0.34

**モック（承認済みの見た目）:** `/private/tmp/claude-501/-Users-skyzhao-orca-workspaces-hiragana-app-amphipod/4e4b5992-0bfc-4e44-a570-3ce7b5f653bb/scratchpad/mock/scene.html`
前提: Stage 1（`2026-10-31-kana-adventure-stage1.md`）は完了済み。

**作業ディレクトリ:** `/Users/skyzhao/orca/workspaces/hiragana-app/amphipod`（コマンドは特記がなければここから）

---

## 設計

**方向性:** やさしい絵本風（パステル調）。SVG と CSS のみ。

**景色:**
- 空: 下から昼の水色 → 夕焼け → 星空の夜。マップの高さに対する割合で変わる。
- 太陽（昼〜夕方のあたり）、月と星（最上部。星は瞬く）。
- 雲は 3 層で、大きさ・濃さ・速さを変えてゆっくり流れる。
- 山（雪つき）、丘、草原、木、花は、最下部に固定して描く。

**道とステージ:**
- 点線をやめ、滑らかに曲がる砂の道にする。
- 足場は石（未到達 🔒）、黄色の足場（クリア済み ★ と旗）にする。
- 🦁 はぴょんと跳ねる。
- 問題部分に柔らかい白の背景パネルを敷き、背景の上でも読みやすくする。

**あわせて直す小さな点:**
- クリア時に最終ステージが 🔒 のままになるのを直す。
- ハート表示と難易度画面のハートに `aria-label` をつける。
- `prefers-reduced-motion` のときは動きを止める。

**やらないこと:** ゲームのルール、問題と選択肢のデザイン、キャラクター。画像素材と新しいライブラリは追加しない。

**テスト方針:** 道の曲線は純粋関数なのでテスト先行で作る。見た目はブラウザで目視確認する（狭い画面と動きを減らす設定も含む）。

## 前提知識

- マップは `KanaAdventureGame.jsx` の `.adventure-path-container`（`position: relative`、`flex-direction: column-reverse`）の中に、ステージ（`.stage-node`、高さ 140px）が下から並ぶ。高さは `pathHeight = PATH_PADDING_TOP + questions.length * NODE_HEIGHT + PATH_PADDING_BOTTOM`（100 + 140n + 150）。
- 道の SVG は `viewBox="0 0 100 ${pathHeight}"`、`preserveAspectRatio="none"`。x は 0〜100 の割合で、左のステージは x=20、右は x=80。
- 現在の背景は、`.mountain-bg`（グラデーション）と雲の `div` 4 つ。難易度選択画面でも `<div className="mountain-bg" />` を使っている。
- コミットメッセージは日本語、末尾に `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`。`--no-verify` は使わない。`package-lock.json` は `.gitignore` 対象。

---

### Task 1: 道の曲線（pathGeometry）

**Files:**
- Create: `frontend/src/components/Games/Kana/pathGeometry.js`
- Test: `frontend/src/components/Games/Kana/pathGeometry.test.js`

**Step 1: 失敗するテストを書く**

```js
import { describe, it, expect } from 'vitest';
import { buildPathD } from './pathGeometry';

const base = { pathHeight: 1000, nodeHeight: 140, paddingBottom: 150 };

describe('buildPathD', () => {
  it('ステージが0個なら、開始点だけの道になる', () => {
    expect(buildPathD({ ...base, count: 0 })).toBe('M 50 1000');
  });

  it('ステージが2個なら、左右に振れる滑らかな曲線になる', () => {
    expect(buildPathD({ ...base, count: 2 })).toBe(
      'M 50 1000 C 50 890 20 890 20 780 C 20 710 80 710 80 640'
    );
  });

  it('曲線の数はステージの数と同じ', () => {
    const d = buildPathD({ ...base, pathHeight: 1790, count: 11 });
    expect(d.match(/C/g)).toHaveLength(11);
  });

  it('最後のステージの中心で終わる', () => {
    // 最後(index 4)の y = 1000 - 150 - 70 - 4 * 140 = 220、x は偶数番目なので 20
    expect(buildPathD({ ...base, count: 5 }).endsWith('20 220')).toBe(true);
  });

  it('ステージ数が増えても、開始点は下端の中央', () => {
    expect(buildPathD({ ...base, pathHeight: 2000, count: 12 }).startsWith('M 50 2000')).toBe(true);
  });
});
```

**Step 2: 失敗を確認する**

Run: `cd frontend && npx vitest run src/components/Games/Kana/pathGeometry.test.js`
Expected: FAIL（`Failed to resolve import "./pathGeometry"`）

**Step 3: 実装する**

```js
// 道の SVG パスを、ステージの位置から組み立てる。
// x は 0〜100 の割合（左=20、右=80）、y は px。
// 各区間は縦向きの接線で結ぶので、S 字の滑らかな曲線になる。
const START_X = 50;
const LEFT_X = 20;
const RIGHT_X = 80;

export const buildPathD = ({ count, pathHeight, nodeHeight, paddingBottom }) => {
  let d = `M ${START_X} ${pathHeight}`;
  let prevX = START_X;
  let prevY = pathHeight;

  for (let i = 0; i < count; i++) {
    const x = i % 2 === 0 ? LEFT_X : RIGHT_X;
    const y = pathHeight - paddingBottom - nodeHeight / 2 - i * nodeHeight;
    const midY = (prevY + y) / 2;
    d += ` C ${prevX} ${midY} ${x} ${midY} ${x} ${y}`;
    prevX = x;
    prevY = y;
  }
  return d;
};
```

**Step 4: 通ることを確認する**

Run: `cd frontend && npx vitest run`
Expected: PASS（既存29件 + 新規5件 = 34件）

**Step 5: コミット**

```bash
git add frontend/src/components/Games/Kana/pathGeometry.js frontend/src/components/Games/Kana/pathGeometry.test.js
git commit -m "feat: 道の曲線を組み立てる純粋関数を追加"
```

---

### Task 2: 背景シーンと道の描画

**Files:**
- Create: `frontend/src/components/Games/Kana/AdventureScene.jsx`
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.jsx`
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.css`

**Step 1: `AdventureScene.jsx` を作る**

```jsx
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
```

**Step 2: シーンのスタイルを CSS に追加する（末尾）**

```css
/* ===== 背景シーン ===== */
.adventure-scene {
  position: absolute;
  inset: 0;
  overflow: hidden;
  pointer-events: none;
  z-index: 0;
}

/* 下=昼 → 夕焼け → 上=星空。マップの高さに対する割合で変わる */
.scene-sky {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to top,
    #cdeefc 0%, #bfe6fb 30%, #ffe3c4 52%, #ffc2b8 68%, #9b8fd6 84%, #3b3f8f 100%
  );
}

.scene-stars {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: auto;
}

.scene-star {
  animation: sceneTwinkle 2.4s ease-in-out infinite;
}

.scene-sun {
  position: absolute;
  right: 8%;
  bottom: 36%;
  width: 180px;
  height: 180px;
  border-radius: 50%;
  background: radial-gradient(circle, #fff3a8 0 16%, #ffe27a 30%, rgba(255, 226, 122, 0) 70%);
}

.scene-cloud {
  position: absolute;
  left: 0;
  height: auto;
  animation: sceneCloudDrift 60s linear infinite;
}
.scene-cloud.far  { width: 90px;  opacity: 0.55; animation-duration: 90s; }
.scene-cloud.mid  { width: 130px; opacity: 0.8;  animation-duration: 65s; }
.scene-cloud.near { width: 180px; opacity: 0.95; animation-duration: 45s; }

.scene-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: auto;
}

@keyframes sceneTwinkle {
  50% { opacity: 0.25; }
}

@keyframes sceneCloudDrift {
  from { transform: translateX(-200px); }
  to { transform: translateX(100vw); }
}

/* ===== 道 ===== */
.adventure-road {
  fill: none;
  stroke: #f3dfb6;
  stroke-width: 30;
  stroke-linecap: round;
  vector-effect: non-scaling-stroke;
}

.adventure-road-dots {
  fill: none;
  stroke: #e6c88a;
  stroke-width: 30;
  stroke-linecap: round;
  stroke-dasharray: 2 16;
  opacity: 0.7;
  vector-effect: non-scaling-stroke;
}

/* ===== 動きを減らす設定 ===== */
@media (prefers-reduced-motion: reduce) {
  .scene-cloud,
  .scene-star {
    animation: none;
  }
}
```

**Step 3: 旧スタイルを削除する（`KanaAdventureGame.css`）**

次のブロックを削除する: `/* Background Mountain Graphic */` の `.mountain-bg { ... }`、`/* Decorative Clouds */` の `.cloud-decoration { ... }`、`@keyframes floatCloud { ... }`。`.winding-path-svg` はそのまま残す。

**Step 4: `KanaAdventureGame.jsx` を書き換える**

1. import を追加する:
```jsx
import AdventureScene from './AdventureScene';
import { buildPathD } from './pathGeometry';
```
2. 難易度選択画面の `<div className="mountain-bg" />` を `<AdventureScene />` に置き換える。
3. ゲーム画面の `{/* Background Layer */}` の `<div className="mountain-bg">…雲4つ…</div>` を丸ごと削除する。
4. `.adventure-path-container` の**最初の子**として `<AdventureScene />` を置く。
5. 道の `<svg className="winding-path-svg" …>…</svg>` を次に置き換える:
```jsx
<svg className="winding-path-svg" viewBox={`0 0 100 ${pathHeight}`} preserveAspectRatio="none">
  <path className="adventure-road" d={roadD} />
  <path className="adventure-road-dots" d={roadD} />
</svg>
```
`roadD` は `pathHeight` の下で計算する:
```jsx
const roadD = buildPathD({
  count: questions.length,
  pathHeight,
  nodeHeight: NODE_HEIGHT,
  paddingBottom: PATH_PADDING_BOTTOM,
});
```

**Step 5: 確認**

Run: `cd frontend && npx vitest run && npx eslint src/components/Games/Kana/AdventureScene.jsx src/components/Games/Kana/KanaAdventureGame.jsx`
Expected: 34件 PASS。eslint は、既存の `onClose` 未使用エラー以外に新しいエラー・警告がない。

**Step 6: コミット**

```bash
git add frontend/src/components/Games/Kana/AdventureScene.jsx frontend/src/components/Games/Kana/KanaAdventureGame.jsx frontend/src/components/Games/Kana/KanaAdventureGame.css
git commit -m "feat: かな冒険クイズに絵本風の背景シーンと滑らかな道を追加"
```

---

### Task 3: ステージの見た目・問題パネル・小さな改善

**Files:**
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.jsx`
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.css`
- Modify: `frontend/src/components/Games/Kana/DifficultySelect.jsx`

**Step 1: ステージを石の足場にする（CSS）**

既存の `.stage-marker`、`.stage-node.locked .stage-marker`、`.stage-node.cleared .stage-marker`、`.stage-node.cleared .stage-marker::after`（旗ざお）の 4 ブロックを次に置き換える:

```css
/* 足場（石）。未到達=灰色、クリア済み=黄色 */
.stage-marker {
  position: relative;
  width: 84px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.2rem;
  font-weight: bold;
  background: #cfd8dc;
  box-shadow: 0 5px 0 #90a4ae;
  transition: all 0.3s;
  z-index: 5;
}

.stage-node.locked .stage-marker {
  color: #78909c;
}

.stage-node.cleared .stage-marker {
  background: #fff59d;
  box-shadow: 0 5px 0 #f9a825;
  color: #f9a825;
}

.stage-flag {
  position: absolute;
  left: 50%;
  bottom: 22px;
  font-size: 1.9rem;
  transform: translateX(-4px);
}
```

**Step 2: 🦁 を跳ねさせ、問題パネルを敷く（CSS）**

`.player-avatar` に `animation: avatarHop 1.1s ease-in-out infinite;` を追加する。`.quiz-active-container` に次を追加する:

```css
  background: rgba(255, 255, 255, 0.72);
  padding: 14px 16px 16px;
  border-radius: 24px;
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
```

末尾に追加する:

```css
@keyframes avatarHop {
  50% { transform: translateY(-12px); }
}

@media (prefers-reduced-motion: reduce) {
  .player-avatar {
    animation: none;
  }
}
```
（`prefers-reduced-motion` のブロックが既にある場合は、`.player-avatar` をそこにまとめてよい。）

**Step 3: マーカーのマークアップとクリア時の表示（`KanaAdventureGame.jsx`）**

1. `isCleared` を、結果画面ではすべてクリア済みにする:
```jsx
const isCleared = idx < currentIndex || screen === 'result';
```
2. クリア済みのマーカーを次にする（`🚩` の `div` を置き換える）:
```jsx
<div className="stage-marker">
  <span className="stage-flag">🚩</span>★
</div>
```
未到達（🔒）のマーカーは、マークアップはそのまま（見た目は CSS で変わる）。
3. ハートバーにラベルをつける:
```jsx
<div className="hearts-bar" role="img" aria-label={`のこり ${hearts} ハート`}>
```

**Step 4: 難易度画面のハート（`DifficultySelect.jsx`）**

```jsx
<span className="difficulty-hearts" role="img" aria-label={`ハート ${difficulty.hearts} こ`}>
  {'❤️'.repeat(difficulty.hearts)}
</span>
```

**Step 5: 確認**

Run: `cd frontend && npx vitest run && npx eslint src/components/Games/Kana`
Expected: 34件 PASS。eslint は、既存の `onClose` 未使用エラーと他ファイルの既存分以外に新しいものがない。

**Step 6: コミット**

```bash
git add frontend/src/components/Games/Kana/KanaAdventureGame.jsx frontend/src/components/Games/Kana/KanaAdventureGame.css frontend/src/components/Games/Kana/DifficultySelect.jsx
git commit -m "feat: ステージを石の足場にし、問題パネルと細かな改善を追加"
```

---

### Task 4: ブラウザでの確認（コントローラが実施）

開発サーバー（http://localhost:5174/）で、かな冒険クイズを開いて確認する。

1. 難易度選択画面に、新しい背景（空、山、草原）が出る。
2. ゲーム開始直後、下は昼の草原と山、スクロールで上に進むと夕焼け、最上部は星と月。
3. 道が滑らかな曲線で、ステージ（石の足場）をつないでいる。
4. 雲が流れ、星が瞬き、🦁 が跳ねる。
5. 問題パネルが背景の上で読みやすい。
6. 間違えて再出題が挟まり、ステージが増えても、背景と道が破綻しない。
7. クリア時、最後のステージが 🔒 のままにならない。
8. 狭い画面（幅 420px）で崩れない。
9. `prefers-reduced-motion: reduce` で、雲・星・🦁 が止まる。
10. ひらがな・カタカナの両方で同様。

不具合があれば修正し、`fix:` のコミットを追加する。3回試して直らなければ、止めて報告する。

---

## 完了条件

- [ ] `npx vitest run` が全て通る（34件）
- [ ] 今回触ったファイルに lint の新しい警告がない
- [ ] Task 4 の確認項目がすべて OK
- [ ] `frontend/dist` が残っていない（`git status` が clean）
