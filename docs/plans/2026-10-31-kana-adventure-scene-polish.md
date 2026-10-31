# かな冒険クイズ 背景の仕上げ（広い画面・ゴール・月）

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development to implement this plan task-by-task.

**Goal:** 広い画面で山が大きくなりすぎる問題と、道の先端が月と重なる問題を直し、マップの上にゴール（山頂の旗）を置く。

**Architecture:** 山・丘・木・花は、幅 420 の絵柄を SVG の `<pattern>` で横に敷き詰める（高さは 460px 固定）。マップの上に余白を足し、道をゴールまで延ばす（`buildPathD` に任意の `goalY` を追加）。ゴールは小さなコンポーネント（`AdventureGoal.jsx`）にし、月は左上の固定位置の小さな SVG にする。

**Tech Stack:** React 18 / SVG / CSS / Vitest 0.34

**前提:** `2026-10-31-kana-adventure-scene.md` は完了済み。作業ディレクトリ: `/Users/skyzhao/orca/workspaces/hiragana-app/amphipod`。コミットメッセージは日本語で、末尾に `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`。`--no-verify` は使わない。

---

## 設計

**① 広い画面（山が大きすぎる）**
- 原因: 山・丘・草原を 1 枚の SVG（幅 420 の設計）として「幅 100%」で拡大しているため、幅 1000px では高さも 2 倍以上になる。
- 対策: 絵柄を `<pattern width="420" height="460">` に入れ、`<rect fill="url(#...)">` で横に並べる。高さは 460px で固定。幅の広い画面では山脈のように連なる。
- 継ぎ目: 山はタイルの内側（x が 0〜420 の範囲）に収める。丘と草原は、タイルの左端と右端で高さをそろえる。

**② 月と道の重なり、ゴール**
- 道の最後のステージの左右は、問題数の偶奇で変わる（再出題でも変わる）。月が右上に固定されているため重なる。
- マップの上に余白を足し（上の余白 100 → 260px）、道を最後のステージからゴール（中央上）まで延ばす。ゴールは山頂の旗にする。
- 月は、道が届かない左上の固定位置に、px 固定の小さな SVG として置く（画面幅で拡大しない）。

**やらないこと:** ゲームのルール、問題と選択肢のデザイン、キャラクター。

---

### Task A: 山・丘を横に敷き詰める

**Files:**
- Modify: `frontend/src/components/Games/Kana/AdventureScene.jsx`（下端の `<svg className="scene-ground" …>` 全体）
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.css`（`.scene-ground`）

**Step 1: `AdventureScene.jsx` の `scene-ground` を次に置き換える**

```jsx
    {/* 下端: 山・丘・草原・木・花。幅 420 の絵柄を横に敷き詰める（高さは固定） */}
    <svg className="scene-ground" width="100%" height="460">
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
        <pattern id="sceneTile" width="420" height="460" patternUnits="userSpaceOnUse">
          {/* 元の座標（上端が y=-40）を保つため 40px 下げる */}
          <g transform="translate(0 40)">
            <path d="M10 190 L80 60 Q95 40 110 60 L200 190Z" fill="#b9c8f0" />
            <path d="M60 190 L190 0 Q210 -30 230 0 L360 190Z" fill="#a9b9e6" />
            <path d="M165 22 L190 0 Q210 -30 230 0 L252 30 Q235 18 222 32 Q210 16 196 32 Q182 20 165 22Z" fill="#fff" />
            <path d="M250 190 L330 80 Q345 62 360 80 L410 190Z" fill="#b3c3ec" />
            {/* 丘と草原は、タイルの左端と右端で高さをそろえて継ぎ目を目立たなくする */}
            <path d="M0 240 Q90 140 200 210 Q300 150 420 240 L420 420 L0 420Z" fill="#a6dc9a" />
            <path d="M0 290 Q110 240 230 280 Q330 310 420 290 L420 420 L0 420Z" fill="url(#sceneGrass)" />
            <use href="#sceneTree" x="40" y="350" />
            <use href="#sceneTree" x="380" y="330" />
            <use href="#sceneTree" x="350" y="380" transform="translate(70 76) scale(0.8)" />
            <use href="#sceneFlower" x="130" y="375" />
            <use href="#sceneFlower" x="270" y="390" />
            <use href="#sceneFlower" x="60" y="400" />
            <use href="#sceneFlower" x="330" y="360" />
          </g>
        </pattern>
      </defs>
      <rect width="100%" height="460" fill="url(#sceneTile)" />
    </svg>
```

**Step 2: CSS の `.scene-ground` を固定の高さにする**

```css
.scene-ground {
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 460px;
}
```
（`height: auto` を `height: 460px` に変える。他は変更しない。）

**Step 3: 確認**

Run: `cd frontend && npx vitest run && npx eslint src/components/Games/Kana/AdventureScene.jsx`
Expected: 34件 PASS、eslint エラーなし

**Step 4: コミット**

```bash
git add frontend/src/components/Games/Kana/AdventureScene.jsx frontend/src/components/Games/Kana/KanaAdventureGame.css
git commit -m "fix: 山と丘を横に敷き詰め、広い画面でも大きくなりすぎないようにする"
```

---

### Task B: ゴール・道の延長・月の移動

**Files:**
- Modify: `frontend/src/components/Games/Kana/pathGeometry.js`（任意の `goalY`）
- Test: `frontend/src/components/Games/Kana/pathGeometry.test.js`
- Create: `frontend/src/components/Games/Kana/AdventureGoal.jsx`
- Modify: `frontend/src/components/Games/Kana/AdventureScene.jsx`（月を別の小さな SVG にする）
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.jsx`
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.css`

**Step 1: 失敗するテストを書く（`pathGeometry.test.js` の `describe` の中に追加）**

```js
  it('goalY を渡すと、最後のステージから中央上のゴールまで道が延びる', () => {
    // 最後のステージ(index 1)は x=80, y=640。中間の y は (640 + 100) / 2 = 370
    expect(buildPathD({ ...base, count: 2, goalY: 100 })).toBe(
      'M 50 1000 C 50 890 20 890 20 780 C 20 710 80 710 80 640 C 80 370 50 370 50 100'
    );
  });

  it('goalY を渡さなければ、道はゴールまで延びない', () => {
    expect(buildPathD({ ...base, count: 2 }).endsWith('80 640')).toBe(true);
  });
```

**Step 2: 失敗を確認する**

Run: `cd frontend && npx vitest run src/components/Games/Kana/pathGeometry.test.js`
Expected: FAIL（ゴール延長のテストのみ失敗）

**Step 3: `pathGeometry.js` を変更する**

関数のシグネチャを `({ count, pathHeight, nodeHeight, paddingBottom, goalY })` にし、`for` ループの後ろ、`return d;` の前に追加する:

```js
  // ゴールが指定されたら、最後のステージから中央上のゴールまで道を延ばす
  if (goalY !== undefined) {
    const midY = (prevY + goalY) / 2;
    d += ` C ${prevX} ${midY} ${START_X} ${midY} ${START_X} ${goalY}`;
  }
```

**Step 4: 通ることを確認する**

Run: `cd frontend && npx vitest run`
Expected: PASS（36件）

**Step 5: `AdventureGoal.jsx` を作る**

```jsx
import React from 'react';

// 山頂の旗（ゴール）。高さは 100px（ラベル 20px + 山 80px）。
// 道の終点は、この山の底（下端）に合わせる。
export const GOAL_HEIGHT = 100;

const AdventureGoal = ({ top }) => (
  <div className="adventure-goal" style={{ top: `${top}px` }}>
    <span className="goal-label">ゴール</span>
    <svg className="goal-peak" viewBox="0 0 90 80" aria-hidden="true">
      <path d="M5 78 L45 22 L85 78Z" fill="#a9b9e6" />
      <path d="M33 40 L45 22 L57 40 Q51 36 45 42 Q39 36 33 40Z" fill="#fff" />
      <rect x="44" y="0" width="3" height="26" fill="#795548" />
      <path d="M47 2 L72 10 L47 18Z" fill="#ef5350" />
    </svg>
  </div>
);

export default AdventureGoal;
```

**Step 6: 月を別の小さな SVG にする（`AdventureScene.jsx`）**

星の `<svg className="scene-stars" …>` の中から、三日月の `<path d="M346 76 …" fill="#fff8d6" />` を削除し、`scene-stars` の `<svg>` の直後に追加する:

```jsx
    <svg className="scene-moon" viewBox="0 0 40 52" aria-hidden="true">
      <path d="M26 2 A26 26 0 1 0 26 52 A30 30 0 0 1 26 2Z" fill="#fff8d6" />
    </svg>
```

**Step 7: `KanaAdventureGame.jsx` を変更する**

1. import を追加する: `import AdventureGoal, { GOAL_HEIGHT } from './AdventureGoal';`
2. 定数を変更・追加する:
```jsx
const PATH_PADDING_TOP = 260; // 上の余白（ゴールのための空間）
const GOAL_Y = 120; // ゴール（山頂）の位置。マップの上端からの距離
```
3. `roadD` の `buildPathD` に `goalY: GOAL_Y` を追加する。
4. `.adventure-path-container` の `style` を、余白もここで指定する形にする（CSS の固定 padding をやめ、定数と同じ値を 1 か所で持つ）:
```jsx
style={{ minHeight: `${pathHeight}px`, paddingTop: `${PATH_PADDING_TOP}px`, paddingBottom: `${PATH_PADDING_BOTTOM}px` }}
```
5. `<AdventureScene />` の直後に、ゴールを置く:
```jsx
<AdventureGoal top={GOAL_Y - GOAL_HEIGHT} />
```

**Step 8: CSS を変更する（`KanaAdventureGame.css`）**

1. `.adventure-path-container` の `padding: 100px 0 150px 0;` の行を削除する（JSX の style に移したため）。`box-sizing` は変更しない。
2. 末尾に追加する:
```css
/* ===== 月（左上に固定。道が届かない場所） ===== */
.scene-moon {
  position: absolute;
  left: 6%;
  top: 36px;
  width: 44px;
  height: auto;
}

/* ===== ゴール（山頂の旗） ===== */
.adventure-goal {
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  z-index: 3;
  pointer-events: none;
}

.goal-label {
  height: 20px;
  line-height: 20px;
  font-size: 0.95rem;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 1px 3px rgba(0, 0, 0, 0.35);
}

.goal-peak {
  width: 90px;
  height: 80px;
}
```

**Step 9: 確認**

Run: `cd frontend && npx vitest run && npx eslint src/components/Games/Kana/AdventureScene.jsx src/components/Games/Kana/AdventureGoal.jsx src/components/Games/Kana/KanaAdventureGame.jsx`
Expected: 36件 PASS。eslint は、既存の `onClose` 未使用エラー以外に新しいエラー・警告がない。

**Step 10: コミット**

```bash
git add frontend/src/components/Games/Kana/pathGeometry.js frontend/src/components/Games/Kana/pathGeometry.test.js frontend/src/components/Games/Kana/AdventureGoal.jsx frontend/src/components/Games/Kana/AdventureScene.jsx frontend/src/components/Games/Kana/KanaAdventureGame.jsx frontend/src/components/Games/Kana/KanaAdventureGame.css
git commit -m "feat: マップの上にゴール（山頂の旗）を置き、道を延ばして月を左上へ移す"
```

---

### Task C: ブラウザでの確認（コントローラが実施）

1. 幅 420 / 1000 / 1600px で、下の山が大きくなりすぎず、広い画面では山脈のように連なる。継ぎ目が目立たない。
2. マップの最上部に、ゴール（山頂の旗）があり、道がそこまで延びている。月は左上で、道と重ならない。
3. 道と各ステージの位置が、ずれていない（`.adventure-path-container` の高さが `pathHeight` と一致する）。
4. 再出題でステージが増えても、ゴールと道が崩れない（問題数の偶奇どちらでも）。
5. クリア・失敗の画面、難易度選択画面が崩れない。
6. 既存の動き（雲、星、🦁、動きを減らす設定）が保たれる。
