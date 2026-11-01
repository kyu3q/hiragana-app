# 漢字ランナー ステージ制 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** 漢字ランナーを、草原→砂漠→雪山→火山の4ステージ制にする（見た目・速さ・敵の割合と見た目が変わる）。

**Architecture:** ステージの違いは `stages.js` の純粋なデータ（設定オブジェクト4つ）に集める。`JumpGame.jsx` は、いまのステージの設定を `stateRef.current.stage` に持ち、コース生成・描画・速さでそれを読む。ステージの流れ（名前表示→プレイ→クリア→つぎへ）は、`gameState` に `intro` と `stageClear` を足して作る。設計は `docs/plans/2026-11-01-jump-game-stages-design.md`。

**Tech Stack:** React 18、Canvas 2D、Vitest（node環境）、ESLint。

**作業ディレクトリ:** `frontend/`（コマンドはここから実行）。コミットのトレーラーは `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>`。

**スコアの扱い（設計文書の訂正）:** `onAddScore` は、アイテムを取るたびに呼ぶ今の形のまま変えない。画面に表示するスコアだけ、ステージをまたいで引き継ぐ。ゲームオーバーのリトライでは、表示スコアをそのステージの開始時点に戻す（コンテナの合計は、今も戻していないので、同じ挙動）。

---

### Task 1: ステージ設定のデータとテスト

**Files:**
- Create: `src/components/Games/KanjiCard/stages.js`
- Create: `src/components/Games/KanjiCard/stages.test.js`

**Step 1: 失敗するテストを書く**

```js
import { describe, it, expect } from 'vitest';
import { STAGES, PATTERN_ORDER, pickPattern, isLastStage, stageTitle } from './stages';

describe('STAGES', () => {
  it('草原・砂漠・雪山・火山の4ステージがこの順で並ぶ', () => {
    expect(STAGES.map((s) => s.id)).toEqual(['meadow', 'desert', 'snow', 'volcano']);
  });

  it('最初のステージの速さは1.0（今までと同じ）', () => {
    expect(STAGES[0].speed).toBe(1.0);
  });

  it('進むほど、速さが上がる', () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].speed).toBeGreaterThan(STAGES[i - 1].speed);
    }
  });

  it('進むほど、コースが長くなる', () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].levelLength).toBeGreaterThan(STAGES[i - 1].levelLength);
    }
  });

  it('どのステージも、パターンの割合の合計が1になる', () => {
    STAGES.forEach((s) => {
      const total = PATTERN_ORDER.reduce((sum, key) => sum + s.weights[key], 0);
      expect(total).toBeCloseTo(1, 10);
    });
  });

  it('どのステージも、見た目の設定と名前がそろっている', () => {
    STAGES.forEach((s) => {
      expect(s.name).toBeTruthy();
      expect(s.theme.sky).toHaveLength(2);
      expect(s.theme.ground).toBeTruthy();
      expect(['none', 'snow', 'embers']).toContain(s.theme.weather);
    });
  });

  it('草原以外は、敵の見た目（絵文字）がそろっている', () => {
    expect(STAGES[0].enemySkin).toBeNull();
    STAGES.slice(1).forEach((s) => {
      expect(Object.keys(s.enemySkin).sort()).toEqual(['bird', 'slime', 'spike']);
    });
  });
});

describe('pickPattern', () => {
  const meadow = STAGES[0].weights;

  it('草原の割合は、今までの割合（0.2 / 0.4 / 0.55 / 0.7 / 0.8 / 0.9）と同じ', () => {
    expect(pickPattern({ weights: meadow, r: 0.1 })).toBe('upperPath');
    expect(pickPattern({ weights: meadow, r: 0.3 })).toBe('groundEnemy');
    expect(pickPattern({ weights: meadow, r: 0.47 })).toBe('bird');
    expect(pickPattern({ weights: meadow, r: 0.62 })).toBe('stairs');
    expect(pickPattern({ weights: meadow, r: 0.75 })).toBe('spike');
    expect(pickPattern({ weights: meadow, r: 0.85 })).toBe('powerup');
    expect(pickPattern({ weights: meadow, r: 0.95 })).toBe('gap');
  });

  it('境目の値は、次のパターンに入る', () => {
    expect(pickPattern({ weights: meadow, r: 0.2 })).toBe('groundEnemy');
  });

  it('1に近い値でも、最後のパターンを返す（浮動小数点の誤差で落ちない）', () => {
    expect(pickPattern({ weights: meadow, r: 0.9999999999 })).toBe('gap');
  });

  it('砂漠は、草原よりトゲが出やすい', () => {
    expect(STAGES[1].weights.spike).toBeGreaterThan(meadow.spike);
  });

  it('雪山は、草原より鳥が出やすい', () => {
    expect(STAGES[2].weights.bird).toBeGreaterThan(meadow.bird);
  });
});

describe('isLastStage / stageTitle', () => {
  it('最後のステージだけ true', () => {
    expect(isLastStage(0)).toBe(false);
    expect(isLastStage(2)).toBe(false);
    expect(isLastStage(3)).toBe(true);
  });

  it('「ステージ1　そうげん」の形の名前を返す', () => {
    expect(stageTitle(0)).toBe('ステージ1　そうげん');
  });
});
```

**Step 2: 失敗を確認する**

Run: `npx vitest run src/components/Games/KanjiCard/stages.test.js`
Expected: FAIL（`./stages` が見つからない）

**Step 3: 実装する**

```js
// 漢字ランナーのステージ設定。画面や canvas に依存しない、データと純粋関数だけを置く。

// コースのパターン。この順番で、割合の累積を取る（草原は今までの 0.2 / 0.4 / 0.55 / 0.7 / 0.8 / 0.9 の境目と同じ）
export const PATTERN_ORDER = ['upperPath', 'groundEnemy', 'bird', 'stairs', 'spike', 'powerup', 'gap'];

export const STAGES = [
  {
    id: 'meadow',
    name: 'そうげん',
    speed: 1.0,
    levelLength: 7000,
    weights: { upperPath: 0.2, groundEnemy: 0.2, bird: 0.15, stairs: 0.15, spike: 0.1, powerup: 0.1, gap: 0.1 },
    theme: {
      sky: ['#4FC3F7', '#E1F5FE'],
      mountain: { hue: 120, hueRange: 40, saturation: 30, lightness: 20, lightnessRange: 20 },
      cloud: 'rgba(255, 255, 255, 0.7)',
      ground: '#795548',
      groundTop: '#8BC34A',
      groundDecor: '#689F38',
      weather: 'none',
    },
    enemySkin: null, // null のときは、今までの描き方
  },
  {
    id: 'desert',
    name: 'さばく',
    speed: 1.1,
    levelLength: 8000,
    weights: { upperPath: 0.15, groundEnemy: 0.2, bird: 0.1, stairs: 0.15, spike: 0.2, powerup: 0.1, gap: 0.1 },
    theme: {
      sky: ['#FFB74D', '#FFF3E0'],
      mountain: { hue: 30, hueRange: 15, saturation: 55, lightness: 40, lightnessRange: 15 },
      cloud: 'rgba(255, 255, 255, 0.4)',
      ground: '#D7A86E',
      groundTop: '#F0C987',
      groundDecor: '#C8964F',
      weather: 'none',
    },
    enemySkin: { slime: '🦂', bird: '🦅', spike: '🌵' },
  },
  {
    id: 'snow',
    name: 'ゆきやま',
    speed: 1.2,
    levelLength: 9000,
    weights: { upperPath: 0.15, groundEnemy: 0.15, bird: 0.25, stairs: 0.15, spike: 0.1, powerup: 0.1, gap: 0.1 },
    theme: {
      sky: ['#90CAF9', '#FFFFFF'],
      mountain: { hue: 200, hueRange: 20, saturation: 30, lightness: 70, lightnessRange: 15 },
      cloud: 'rgba(255, 255, 255, 0.85)',
      ground: '#B0BEC5',
      groundTop: '#FFFFFF',
      groundDecor: '#CFD8DC',
      weather: 'snow',
    },
    enemySkin: { slime: '⛄', bird: '🐧', spike: '🧊' },
  },
  {
    id: 'volcano',
    name: 'かざん',
    speed: 1.3,
    levelLength: 10000,
    weights: { upperPath: 0.15, groundEnemy: 0.2, bird: 0.2, stairs: 0.1, spike: 0.2, powerup: 0.1, gap: 0.05 },
    theme: {
      sky: ['#3E1F1F', '#BF360C'],
      mountain: { hue: 5, hueRange: 20, saturation: 60, lightness: 15, lightnessRange: 10 },
      cloud: 'rgba(80, 60, 60, 0.6)',
      ground: '#3E2723',
      groundTop: '#FF5722',
      groundDecor: '#D84315',
      weather: 'embers',
    },
    enemySkin: { slime: '🔥', bird: '🦇', spike: '🌋' },
  },
];

// 0以上1未満の乱数 r から、割合（weights）に従ってコースのパターンを1つ選ぶ
export const pickPattern = ({ weights, r }) => {
  let total = 0;
  for (const key of PATTERN_ORDER) {
    total += weights[key];
    if (r < total) return key;
  }
  return PATTERN_ORDER[PATTERN_ORDER.length - 1]; // 足し算の誤差で、合計が1にわずかに届かないとき
};

export const isLastStage = (index) => index === STAGES.length - 1;

export const stageTitle = (index) => `ステージ${index + 1}　${STAGES[index].name}`;
```

**Step 4: 通ることを確認する**

Run: `npx vitest run src/components/Games/KanjiCard/stages.test.js`
Expected: PASS（全件）

**Step 5: コミット**

```bash
git add src/components/Games/KanjiCard/stages.js src/components/Games/KanjiCard/stages.test.js
git commit -m "feat: 漢字ランナーの4ステージの設定データを追加する"
```
（本文の末尾にトレーラーを付ける）

---

### Task 2: コース生成を、ステージの設定で動かす（草原は今までと同じ）

**Files:**
- Modify: `src/components/Games/KanjiCard/JumpGame.jsx`（`initGame` の約63〜227行、`stateRef` の初期値の約40〜61行）

ここでは、ステージ1（草原）の動きが**今までと変わらない**ことが条件。

**Step 1: import を足す**

`jumpGameLogic` の import の下に追加:

```js
import { STAGES, pickPattern, isLastStage, stageTitle } from './stages';
```

**Step 2: `initGame` を、ステージ番号と開始スコアを受け取る形にする**

- `const initGame = () => {` → `const initGame = (stageIndex = 0, startScore = 0) => {`
- 先頭の `const items = [];` の前に `const stage = STAGES[stageIndex];` を足す。
- 山の色（`color: \`hsl(...)\`` の行）を、設定から作る:

```js
const m = stage.theme.mountain;
// ... mountains.push の color:
color: `hsl(${m.hue + Math.random() * m.hueRange}, ${m.saturation}%, ${m.lightness + Math.random() * m.lightnessRange}%)`
```
（`const m` は `mountains` のループの前に置く。）

- `const levelLength = 10000; // Longer level` → `const levelLength = stage.levelLength;`
- パターンの分岐を、割合の設定で選ぶ形にする。`const type = Math.random();` の下に `const pattern = pickPattern({ weights: stage.weights, r: type });` を足し、`if (type < 0.2) {` から続く分岐を次のように置き換える:

| 今 | 変更後 |
|---|---|
| `if (type < 0.2) {` | `if (pattern === 'upperPath') {` |
| `} else if (type < 0.4) {` | `} else if (pattern === 'groundEnemy') {` |
| `} else if (type < 0.55) {` | `} else if (pattern === 'bird') {` |
| `} else if (type < 0.7) {` | `} else if (pattern === 'stairs') {` |
| `} else if (type < 0.8) {` | `} else if (pattern === 'spike') {` |
| `} else if (type < 0.9) {` | `} else if (pattern === 'powerup') {` |
| `} else {`（Empty gap） | 変更なし（`gap`） |

- `stateRef.current = {` の中を変更:
  - `score: 0,` → `score: startScore,`
  - `stage, stageIndex,` を足す。
- 末尾の `setScore(0);` → `setScore(startScore);`

**Step 3: `stateRef` の初期値に `stage` を足す**

`useRef({ ... })` の `player` の上に `stage: STAGES[0], stageIndex: 0,` を足す（`draw` が初期描画で `state.stage` を読むため）。

**Step 4: 速さを設定から読む**

`step` の `let intendedMove = MOVE_SPEED;` → `let intendedMove = MOVE_SPEED * state.stage.speed;`

**Step 5: 確認する**

Run: `npx vitest run && npx eslint src/components/Games/KanjiCard/JumpGame.jsx`
Expected: 全件パス、エラー0（警告3件は今までどおり）。

ブラウザ（一時的な `harness.html` / `harness.jsx` を `frontend/` に置き、確認後に消す）: ゲームを開始して、1.5秒後にカメラ位置が以前と同じ（約 3.5px × 90フレーム ≒ 315）であること、パターンが出ていることを `stateRef` で確認する。

**Step 6: コミット**

```bash
git add src/components/Games/KanjiCard/JumpGame.jsx
git commit -m "refactor: 漢字ランナーのコース生成と速さを、ステージの設定から読むようにする"
```

---

### Task 3: ステージごとの見た目（背景・地面・天気・敵）

**Files:**
- Modify: `src/components/Games/KanjiCard/JumpGame.jsx`（`draw` 関数、約553〜869行）

**Step 1: 空・雲・地面を、設定の色にする**

- 空: `gradient.addColorStop(0, '#4FC3F7')` / `(1, '#E1F5FE')` → `state.stage.theme.sky[0]` / `[1]`
- 雲: `ctx.fillStyle = 'rgba(255, 255, 255, 0.7)'` → `state.stage.theme.cloud`
- 地面: `'#795548'` → `theme.ground`、草 `'#8BC34A'` → `theme.groundTop`、飾り `'#689F38'` → `theme.groundDecor`
  （`const theme = state.stage.theme;` を `draw` の先頭に置いて使う）

**Step 2: 天気（雪・火の粉）を描く関数を足す**

`draw` の直前に追加:

```js
  // 雪・火の粉。画面に固定で描き、時間だけで動かす（状態は持たない）
  const drawWeather = (ctx, weather) => {
    if (weather === 'none') return;
    const t = Date.now();
    ctx.save();
    for (let i = 0; i < 40; i++) {
      const seed = i * 137.5;
      const x = (seed * 7 + Math.sin(t / 1000 + i) * 20) % CANVAS_WIDTH;
      if (weather === 'snow') {
        const y = (seed * 3 + t * 0.05) % CANVAS_HEIGHT;
        ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
        ctx.beginPath(); ctx.arc(Math.abs(x), y, 2 + (i % 3), 0, Math.PI * 2); ctx.fill();
      } else {
        const y = CANVAS_HEIGHT - ((seed * 3 + t * 0.06) % CANVAS_HEIGHT);
        ctx.fillStyle = i % 2 === 0 ? 'rgba(255, 152, 0, 0.8)' : 'rgba(255, 87, 34, 0.8)';
        ctx.beginPath(); ctx.arc(Math.abs(x), y, 1.5 + (i % 2), 0, Math.PI * 2); ctx.fill();
      }
    }
    ctx.restore();
  };

  // 絵文字を中心の位置に描く（描画の設定を、ほかの描画に残さない）
  const drawEmoji = (ctx, emoji, cx, cy, size) => {
    ctx.save();
    ctx.font = `${size}px sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(emoji, cx, cy);
    ctx.restore();
  };
```

`draw` の中の、ゲーム世界を描く `ctx.restore();`（`// -- UI Overlay --` の直前）のあとに `drawWeather(ctx, theme.weather);` を足す。

**Step 3: 敵の見た目を差し替える**

- 敵のループ（`state.enemies.forEach(e => {`）の `if (!e.active) return;` の直後に追加:

```js
        const skin = state.stage.enemySkin && state.stage.enemySkin[e.type];
        if (skin) {
            drawEmoji(ctx, skin, e.x + e.w / 2, e.y + e.h / 2, e.h);
            return;
        }
```

- トゲ（`obs.type === 'spike'` の分岐）の先頭に追加:

```js
            const spikeSkin = state.stage.enemySkin && state.stage.enemySkin.spike;
            if (spikeSkin) {
                drawEmoji(ctx, spikeSkin, obs.x + obs.w / 2, obs.y + obs.h / 2, obs.h * 1.1);
                return;
            }
```
（`obstacles.forEach(obs => {` のコールバック内なので、`return` で次の要素へ進む。）

**Step 4: 確認する**

Run: `npx vitest run && npx eslint src/components/Games/KanjiCard/JumpGame.jsx`
Expected: 全件パス、エラー0。

ブラウザ（一時 harness）: `initGame` は外から呼べないので、Task 4 のあとにまとめて4ステージを見る。ここでは草原が以前と同じ見た目（スクリーンショットで確認）であることだけ確かめる。

**Step 5: コミット**

```bash
git add src/components/Games/KanjiCard/JumpGame.jsx
git commit -m "feat: 漢字ランナーの背景・地面・天気・敵の見た目を、ステージの設定で変えられるようにする"
```

---

### Task 4: ステージの流れ（名前表示・クリア・つぎへ）

**Files:**
- Modify: `src/components/Games/KanjiCard/JumpGame.jsx`

**Step 1: 状態を足す**

- `gameState` のコメントを `// start, intro, playing, stageClear, won, lost` にする。
- `const [stageIndex, setStageIndex] = useState(0);` と `const stageStartScoreRef = useRef(0); // そのステージを始めたときのスコア（リトライで戻す）` を足す。

**Step 2: ステージを始める関数を足す**

`jump` の前に追加:

```js
  // ステージを始める。名前を出すとき（最初・つぎへ）は intro、リトライはすぐ playing
  const startStage = (index, startScore, withIntro) => {
    stageStartScoreRef.current = startScore;
    setStageIndex(index);
    setPaused(false);
    initGame(index, startScore);
    const canvas = canvasRef.current;
    if (canvas) draw(canvas.getContext('2d'), stateRef.current);
    setGameState(withIntro ? 'intro' : 'playing');
  };
```

**Step 3: ゴールの処理を、ステージの最後かどうかで分ける**

`step` の `if (reachedGoal) {` の中を:

```js
    if (reachedGoal) {
        playFinishSound();
        if (isLastStage(state.stageIndex)) {
            setGameState('won');
            onComplete(true);
        } else {
            setGameState('stageClear');
        }
        return false;
    }
```

**Step 4: 名前表示を、2秒で playing に進める**

`gameState` で動くループの effect の近くに追加:

```js
  // ステージの名前を2秒見せてから、始める
  useEffect(() => {
    if (gameState !== 'intro') return undefined;
    const timer = setTimeout(() => setGameState('playing'), 2000);
    return () => clearTimeout(timer);
  }, [gameState]);
```

**Step 5: 画面（JSX）を変える**

- スタートボタンの `onClick`: `initGame(); setPaused(false); setGameState('playing');` → `startStage(0, 0, true);`
- リトライボタンの `onClick`: → `startStage(stageIndex, stageStartScoreRef.current, false);`
- `lost` の `<div className="game-result-modal">` の下に、クリア画面と名前表示を追加:

```jsx
      {gameState === 'intro' && (
        <div className="game-instruction-overlay">
          <h3>{stageTitle(stageIndex)}</h3>
          <p>{STAGES[stageIndex].name}を走りぬけよう！</p>
        </div>
      )}

      {gameState === 'stageClear' && (
        <div className="game-result-modal">
          <h2>ステージクリア！</h2>
          <div style={{ fontSize: '2rem', margin: '10px 0' }}>スコア: {score}</div>
          <button className="start-btn" onClick={() => startStage(stageIndex + 1, stateRef.current.score, true)}>
            つぎへ
          </button>
        </div>
      )}
```

- スタート画面に、`<p style={{fontSize: '0.9em', color:'#69F0AE'}}>🚩 …</p>` の下へ追加: `<p style={{fontSize: '0.9em'}}>4つのステージを、つづけて走りぬけよう！</p>`

**Step 6: 画面の上に、ステージ番号を出す**

`draw` の `// Target display` のブロックの最後（`ctx.fillText(config.targetChar, ...)` の後）に追加:

```js
    ctx.font = "16px Arial";
    ctx.fillStyle = "white";
    ctx.textAlign = "center";
    ctx.fillText(`ステージ ${state.stageIndex + 1}/${STAGES.length}　${state.stage.name}`, CANVAS_WIDTH / 2, 82);
```

**Step 7: 確認する**

Run: `npx vitest run && npx eslint src/components/Games/KanjiCard/JumpGame.jsx`
Expected: 全件パス、エラー0。

**Step 8: コミット**

```bash
git add src/components/Games/KanjiCard/JumpGame.jsx
git commit -m "feat: 漢字ランナーに、ステージの名前表示・クリア画面・つぎへの流れを追加する"
```

---

### Task 5: 4ステージを通して、ブラウザで確認する

**Files:** 一時的な `frontend/harness.html` / `frontend/harness.jsx`（確認後に消す。コミットしない）

harness は `React.useRef` をフックして `stateRef` を `window.__state` に出す（前回までと同じ方法）。

**Step 1: 流れの確認**

- スタート → `intro`（名前が出る）→ 2秒後に `playing`、になること。
- `stateRef.current.player.x = levelLength - 30` でゴールに触れさせ、ステージ1〜3で「ステージクリア！」が出ること。
- 「つぎへ」で次のステージに進み、スコアが引き継がれること。
- ステージ4のゴールで `onComplete(true)` が1回だけ呼ばれること。
- ゲームオーバー → リトライで、そのステージの最初から、スコアがそのステージの開始時点に戻ること。

**Step 2: 見た目の確認**

各ステージで `agent-browser screenshot` を撮り、空・山・地面・敵の絵文字・雪/火の粉が出ていることを目で見る。

**Step 3: 速さの確認**

各ステージで、1.5秒後のカメラ位置が、約 315 × speed（1.0 / 1.1 / 1.2 / 1.3）になること。

**Step 4: 設計文書を直してコミット**

`docs/plans/2026-11-01-jump-game-stages-design.md` の「`onAddScore` は、最後の1回だけ合計を渡す」を、「`onAddScore` は、アイテムを取るたびに呼ぶ今の形のまま。表示スコアだけ引き継ぐ」に直す。

```bash
rm -f harness.html harness.jsx
git add ../docs/plans/2026-11-01-jump-game-stages-design.md
git commit -m "docs: ステージ制の設計のスコアの扱いを、実際のコードに合わせて直す"
```

**Step 5: 最終確認**

Run: `npx vitest run && npx eslint src/components/Games/KanjiCard/`
Expected: 全件パス。

---

## 確認できないこと・リスク

- 速さ（1.0〜1.3）とコースの長さ、敵の割合は、初期値。遊んで調整する（`stages.js` の数値だけを変えればよい）。
- 速さを上げると、反応できる時間が短くなる。足場・敵の間隔は変えていないので、火山で難しすぎないかは、遊んで確かめる。
- 敵の絵文字は、OS・ブラウザで見た目が変わる。
- 一時停止・チェックポイント・先行入力は、ステージをまたいでも、今のまま動く想定。ステージの切り替え時に、状態が残らないか（`initGame` が作り直す）を、Task 5 で確かめる。
