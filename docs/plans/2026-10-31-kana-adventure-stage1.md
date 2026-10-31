# かな冒険クイズ Stage 1 実装計画

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** かな冒険クイズに、難易度選択・ハート制・音声出題（Web Speech API）・苦手文字の再出題を追加する。

**Architecture:** 問題生成と難易度設定を純粋関数（`adventureConfig.js` / `questionGenerator.js`）に切り出してテスト先行で作る。音声は `utils/speech.js` の薄いラッパーにまとめ、`KanaAdventureGame.jsx` は画面遷移（難易度選択 → 冒険 → 結果/ざんねん）と状態管理だけを担当する。

**Tech Stack:** React 18 / Vite 4 / Vitest 0.34（新規追加。Vite 4 と互換のため 0.34 系に固定）/ Web Speech API

**設計書:** `docs/plans/2026-10-31-kana-adventure-stage1-design.md`

**作業ディレクトリ:** `/Users/skyzhao/orca/workspaces/hiragana-app/amphipod`（以降のコマンドは特記がなければこのルートから実行）

---

## 前提知識

- 文字データは `frontend/src/data/hiraganaData.js` の `hiraganaGroups`（と `katakanaData.js` の `katakanaGroups`）で、`groups[].characters[]` が `{ id, char, romaji, image }` を持つ。
- 効果音は `frontend/src/utils/soundPlayer.js`（`playOK1Sound` / `playWrongSound` / `playHappy1Sound`）、紙吹雪は `utils/confettiEffect.js`（`triggerConfetti`）。
- `KanaAdventureGame` は `GameMode.jsx` から `<CurrentGame onClose={onClose} type={type} />` で呼ばれる。`type` は `'hiragana'` か `'katakana'`。props は変えない。
- 開発サーバーは `frontend` で `npx vite --no-open`（ポート 5174）。起動中なら HMR で反映される。
- コミットメッセージは日本語、末尾に `Co-Authored-By: Claude Sonnet 5.5 <noreply@anthropic.com>` を付ける。`--no-verify` は使わない。

---

### Task 1: Vitest 導入と難易度設定

**Files:**
- Modify: `frontend/package.json`（scripts と devDependencies）
- Create: `frontend/src/components/Games/Kana/adventureConfig.js`
- Test: `frontend/src/components/Games/Kana/adventureConfig.test.js`

**Step 1: Vitest を導入する**

```bash
cd frontend
npm install -D vitest@^0.34.6
```

`frontend/package.json` の `scripts` に追加する。

```json
"test": "vitest run"
```

**Step 2: 失敗するテストを書く**

`frontend/src/components/Games/Kana/adventureConfig.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { QUESTION_COUNT, getDifficulty } from './adventureConfig';

describe('adventureConfig', () => {
  it('やさしいは選択肢3個・ハート5個・音声出題のみ', () => {
    expect(getDifficulty('easy')).toMatchObject({
      optionCount: 3,
      hearts: 5,
      types: ['sound-to-char'],
    });
  });

  it('ふつうは選択肢4個・ハート3個・音声と文字→ローマ字', () => {
    expect(getDifficulty('normal')).toMatchObject({
      optionCount: 4,
      hearts: 3,
      types: ['sound-to-char', 'char-to-romaji'],
    });
  });

  it('むずかしいは選択肢4個・ハート2個・3種類の出題', () => {
    expect(getDifficulty('hard')).toMatchObject({
      optionCount: 4,
      hearts: 2,
      types: ['romaji-to-char', 'char-to-romaji', 'sound-to-char'],
    });
  });

  it('未知の難易度は明確なエラーにする', () => {
    expect(() => getDifficulty('unknown')).toThrow('未知の難易度: unknown');
  });

  it('出題数は10問', () => {
    expect(QUESTION_COUNT).toBe(10);
  });
});
```

**Step 3: テストが失敗することを確認する**

Run: `cd frontend && npx vitest run`
Expected: FAIL（`Failed to resolve import "./adventureConfig"`）

**Step 4: 最小限の実装を書く**

`frontend/src/components/Games/Kana/adventureConfig.js`:

```js
// かな冒険クイズの難易度設定
export const QUESTION_COUNT = 10;

export const DIFFICULTIES = {
  easy: {
    label: 'やさしい',
    emoji: '🌱',
    optionCount: 3,
    hearts: 5,
    types: ['sound-to-char'],
  },
  normal: {
    label: 'ふつう',
    emoji: '🌿',
    optionCount: 4,
    hearts: 3,
    types: ['sound-to-char', 'char-to-romaji'],
  },
  hard: {
    label: 'むずかしい',
    emoji: '🔥',
    optionCount: 4,
    hearts: 2,
    types: ['romaji-to-char', 'char-to-romaji', 'sound-to-char'],
  },
};

export const getDifficulty = (key) => {
  const difficulty = DIFFICULTIES[key];
  if (!difficulty) {
    throw new Error(`未知の難易度: ${key}`);
  }
  return difficulty;
};
```

**Step 5: テストが通ることを確認する**

Run: `cd frontend && npx vitest run`
Expected: PASS（5 tests）

**Step 6: コミット**

```bash
git add frontend/package.json frontend/package-lock.json frontend/src/components/Games/Kana/adventureConfig.js frontend/src/components/Games/Kana/adventureConfig.test.js
git commit -m "feat: かな冒険クイズの難易度設定とVitestを追加"
```

---

### Task 2: 問題生成（generateQuestions / buildQuestion / resolveType）

**Files:**
- Create: `frontend/src/components/Games/Kana/questionGenerator.js`
- Test: `frontend/src/components/Games/Kana/questionGenerator.test.js`

**Step 1: 失敗するテストを書く**

`frontend/src/components/Games/Kana/questionGenerator.test.js`:

```js
import { describe, it, expect } from 'vitest';
import { getDifficulty } from './adventureConfig';
import { generateQuestions, buildQuestion, resolveType } from './questionGenerator';

const makeChars = (n) =>
  Array.from({ length: n }, (_, i) => ({ id: i + 1, char: `文${i + 1}`, romaji: `r${i + 1}` }));

// ローマ字が重複する文字（じ/ぢ のようなケース）を含むデータ
const charsWithDuplicateRomaji = () => [
  { id: 1, char: 'じ', romaji: 'ji' },
  { id: 2, char: 'ぢ', romaji: 'ji' },
  { id: 3, char: 'ず', romaji: 'zu' },
  { id: 4, char: 'づ', romaji: 'zu' },
  { id: 5, char: 'あ', romaji: 'a' },
  { id: 6, char: 'い', romaji: 'i' },
];

const repeat = (times, fn) => Array.from({ length: times }, fn);

describe('generateQuestions', () => {
  it('指定した数の問題を生成する', () => {
    const questions = generateQuestions({ chars: makeChars(46), difficulty: 'normal', count: 10 });
    expect(questions).toHaveLength(10);
  });

  it('出題される文字に重複がない', () => {
    const questions = generateQuestions({ chars: makeChars(46), difficulty: 'normal', count: 10 });
    const ids = questions.map((q) => q.target.id);
    expect(new Set(ids).size).toBe(10);
  });

  it('どの問題の選択肢にも正解が1つだけ含まれる', () => {
    const results = repeat(50, () =>
      generateQuestions({ chars: makeChars(46), difficulty: 'normal' }).every(
        (q) => q.options.filter((o) => o.id === q.target.id).length === 1
      )
    );
    expect(results.every(Boolean)).toBe(true);
  });

  it('やさしいは選択肢が3個', () => {
    const questions = generateQuestions({ chars: makeChars(46), difficulty: 'easy' });
    expect(questions.every((q) => q.options.length === 3)).toBe(true);
  });

  it('ふつうは選択肢が4個', () => {
    const questions = generateQuestions({ chars: makeChars(46), difficulty: 'normal' });
    expect(questions.every((q) => q.options.length === 4)).toBe(true);
  });

  it('選択肢のローマ字が重複しない', () => {
    const results = repeat(100, () => {
      const questions = generateQuestions({
        chars: charsWithDuplicateRomaji(),
        difficulty: 'normal',
        count: 6,
      });
      return questions.every((q) => new Set(q.options.map((o) => o.romaji)).size === q.options.length);
    });
    expect(results.every(Boolean)).toBe(true);
  });

  it('出題タイプは難易度で許可されたものだけ', () => {
    const { types } = getDifficulty('hard');
    const questions = generateQuestions({ chars: makeChars(46), difficulty: 'hard' });
    expect(questions.every((q) => types.includes(q.type))).toBe(true);
  });

  it('生成直後の問題は再出題ではない', () => {
    const questions = generateQuestions({ chars: makeChars(46), difficulty: 'normal' });
    expect(questions.every((q) => q.isRetry === false)).toBe(true);
  });

  it('苦手文字（半数まで）が必ず出題される', () => {
    const weakIds = [1, 2, 3, 4, 5];
    const results = repeat(30, () => {
      const targetIds = generateQuestions({
        chars: makeChars(46),
        difficulty: 'normal',
        count: 10,
        weakIds,
      }).map((q) => q.target.id);
      return weakIds.every((id) => targetIds.includes(id));
    });
    expect(results.every(Boolean)).toBe(true);
  });

  it('文字データが選択肢数より少ないと明確なエラーにする', () => {
    expect(() => generateQuestions({ chars: makeChars(2), difficulty: 'easy' })).toThrow(
      '文字データが不足しています: 必要 3 件、実際 2 件'
    );
  });
});

describe('buildQuestion', () => {
  it('isRetry を指定すると再出題フラグが立つ', () => {
    const chars = makeChars(10);
    const question = buildQuestion({
      target: chars[0],
      chars,
      difficulty: 'normal',
      isRetry: true,
    });
    expect(question.isRetry).toBe(true);
  });
});

describe('resolveType', () => {
  it('音声が使えないとき音声出題は ローマ字→文字 に置き換わる', () => {
    expect(resolveType('sound-to-char', false)).toBe('romaji-to-char');
  });

  it('音声が使えるときは音声出題のまま', () => {
    expect(resolveType('sound-to-char', true)).toBe('sound-to-char');
  });

  it('音声以外の出題タイプはそのまま', () => {
    expect(resolveType('char-to-romaji', false)).toBe('char-to-romaji');
  });
});
```

**Step 2: テストが失敗することを確認する**

Run: `cd frontend && npx vitest run src/components/Games/Kana/questionGenerator.test.js`
Expected: FAIL（`Failed to resolve import "./questionGenerator"`）

**Step 3: 最小限の実装を書く**

`frontend/src/components/Games/Kana/questionGenerator.js`:

```js
import { getDifficulty, QUESTION_COUNT } from './adventureConfig';

// Fisher-Yates シャッフル（元の配列は変更しない）
const shuffle = (array, random) => {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
};

// 音声が使えないときは、音声出題を ローマ字→文字 に置き換える
// （選択肢はどちらも文字なので、問題の作り直しは不要）
export const resolveType = (type, speechAvailable) =>
  type === 'sound-to-char' && !speechAvailable ? 'romaji-to-char' : type;

// 正解と見分けがつくよう、ローマ字が重複しないダミー選択肢を選ぶ
const pickDistractors = (target, chars, count, random) => {
  const usedRomaji = new Set([target.romaji]);
  const distractors = [];
  for (const candidate of shuffle(chars, random)) {
    if (distractors.length === count) break;
    if (candidate.id === target.id || usedRomaji.has(candidate.romaji)) continue;
    usedRomaji.add(candidate.romaji);
    distractors.push(candidate);
  }
  if (distractors.length < count) {
    throw new Error(
      `ダミー選択肢が不足しています: 必要 ${count} 件、実際 ${distractors.length} 件（正解: ${target.char}）`
    );
  }
  return distractors;
};

export const buildQuestion = ({ target, chars, difficulty, isRetry = false, random = Math.random }) => {
  const { optionCount, types } = getDifficulty(difficulty);
  const type = types[Math.floor(random() * types.length)];
  const distractors = pickDistractors(target, chars, optionCount - 1, random);
  const options = shuffle([target, ...distractors], random);
  return { target, type, options, isRetry };
};

export const generateQuestions = ({
  chars,
  difficulty,
  weakIds = [],
  count = QUESTION_COUNT,
  random = Math.random,
}) => {
  const { optionCount } = getDifficulty(difficulty);
  if (chars.length < optionCount) {
    throw new Error(`文字データが不足しています: 必要 ${optionCount} 件、実際 ${chars.length} 件`);
  }

  // 苦手文字は半数まで優先し、残りはランダムに選ぶ
  const weakChars = shuffle(
    chars.filter((c) => weakIds.includes(c.id)),
    random
  ).slice(0, Math.floor(count / 2));
  const otherChars = shuffle(
    chars.filter((c) => !weakChars.includes(c)),
    random
  ).slice(0, count - weakChars.length);

  return shuffle([...weakChars, ...otherChars], random).map((target) =>
    buildQuestion({ target, chars, difficulty, random })
  );
};
```

**Step 4: テストが通ることを確認する**

Run: `cd frontend && npx vitest run src/components/Games/Kana/questionGenerator.test.js`
Expected: PASS（14 tests）

**Step 5: コミット**

```bash
git add frontend/src/components/Games/Kana/questionGenerator.js frontend/src/components/Games/Kana/questionGenerator.test.js
git commit -m "feat: かな冒険クイズの問題生成を純粋関数として追加"
```

---

### Task 3: 再出題（insertRetry / countScoredQuestions）

**Files:**
- Modify: `frontend/src/components/Games/Kana/questionGenerator.js`（末尾に追加）
- Modify: `frontend/src/components/Games/Kana/questionGenerator.test.js`（import 更新と末尾に追加）

**Step 1: 失敗するテストを書く**

import 行を次のように更新する。

```js
import {
  generateQuestions,
  buildQuestion,
  resolveType,
  insertRetry,
  countScoredQuestions,
} from './questionGenerator';
```

ファイル末尾に追加する。

```js
const makeQuestions = (n) =>
  Array.from({ length: n }, (_, i) => ({ target: { id: i + 1 }, isRetry: false }));
const retryQuestion = { target: { id: 99 }, isRetry: true };

describe('insertRetry', () => {
  it('現在位置の2つ後ろに挿入できる（乱数が小さいとき）', () => {
    const result = insertRetry({
      questions: makeQuestions(10),
      currentIndex: 3,
      retryQuestion,
      random: () => 0,
    });
    expect(result[5]).toBe(retryQuestion);
  });

  it('現在位置の3つ後ろに挿入できる（乱数が大きいとき）', () => {
    const result = insertRetry({
      questions: makeQuestions(10),
      currentIndex: 3,
      retryQuestion,
      random: () => 0.99,
    });
    expect(result[6]).toBe(retryQuestion);
  });

  it('末尾を超える場合は末尾に挿入する', () => {
    const result = insertRetry({
      questions: makeQuestions(10),
      currentIndex: 9,
      retryQuestion,
      random: () => 0.99,
    });
    expect(result[10]).toBe(retryQuestion);
  });

  it('挿入後の問題数は1つ増える', () => {
    const result = insertRetry({
      questions: makeQuestions(10),
      currentIndex: 3,
      retryQuestion,
    });
    expect(result).toHaveLength(11);
  });

  it('元の配列を変更しない', () => {
    const questions = makeQuestions(10);
    insertRetry({ questions, currentIndex: 3, retryQuestion });
    expect(questions).toHaveLength(10);
  });
});

describe('countScoredQuestions', () => {
  it('再出題をスコアの母数に含めない', () => {
    const questions = [...makeQuestions(10), retryQuestion];
    expect(countScoredQuestions(questions)).toBe(10);
  });
});
```

**Step 2: テストが失敗することを確認する**

Run: `cd frontend && npx vitest run src/components/Games/Kana/questionGenerator.test.js`
Expected: FAIL（`insertRetry is not a function` など）

**Step 3: 最小限の実装を書く**

`questionGenerator.js` の末尾に追加する。

```js
// 間違えた文字を、現在位置の2〜3問後ろに再出題として差し込む
export const insertRetry = ({ questions, currentIndex, retryQuestion, random = Math.random }) => {
  const offset = 2 + Math.floor(random() * 2);
  const position = Math.min(currentIndex + offset, questions.length);
  return [...questions.slice(0, position), retryQuestion, ...questions.slice(position)];
};

// 再出題はスコアの母数に含めない
export const countScoredQuestions = (questions) => questions.filter((q) => !q.isRetry).length;
```

**Step 4: テストが通ることを確認する**

Run: `cd frontend && npx vitest run`
Expected: PASS（全テスト）

**Step 5: コミット**

```bash
git add frontend/src/components/Games/Kana/questionGenerator.js frontend/src/components/Games/Kana/questionGenerator.test.js
git commit -m "feat: 間違えた文字の再出題ロジックを追加"
```

---

### Task 4: 音声ラッパー（speech.js）

UI と実ブラウザの API に依存するため、自動テストは書かない（設計書のテスト方針どおり。Task 7 で手動確認する）。

**Files:**
- Create: `frontend/src/utils/speech.js`

**Step 1: 実装を書く**

```js
// Web Speech API の薄いラッパー
const LANG = 'ja-JP';
const RATE = 0.8; // 子ども向けにゆっくり読み上げる

const isSupported = () =>
  typeof window !== 'undefined' &&
  'speechSynthesis' in window &&
  typeof SpeechSynthesisUtterance !== 'undefined';

// 日本語の音声が無い環境は、非対応と同じ扱いにする
export const isSpeechAvailable = () =>
  isSupported() && window.speechSynthesis.getVoices().some((v) => v.lang.toLowerCase().startsWith('ja'));

// Chrome は音声一覧を非同期で読み込むため、先に呼んで読み込みを始めておく
export const warmUpVoices = () => {
  if (isSupported()) {
    window.speechSynthesis.getVoices();
  }
};

// 読み上げを開始できたら true。失敗時は理由をログに残し、onError を呼ぶ
export const speak = (text, onError) => {
  if (!isSpeechAvailable()) {
    console.warn('音声読み上げが利用できません（日本語の音声が見つかりません）');
    if (onError) onError();
    return false;
  }
  const utterance = new SpeechSynthesisUtterance(text);
  utterance.lang = LANG;
  utterance.rate = RATE;
  utterance.onerror = (event) => {
    console.warn(`音声読み上げに失敗しました: ${event.error}`);
    if (onError) onError();
  };
  window.speechSynthesis.cancel();
  window.speechSynthesis.speak(utterance);
  return true;
};
```

**Step 2: 構文を確認する**

Run: `cd frontend && npx eslint src/utils/speech.js`
Expected: エラーなし

**Step 3: コミット**

```bash
git add frontend/src/utils/speech.js
git commit -m "feat: Web Speech APIの読み上げラッパーを追加"
```

---

### Task 5: 難易度選択画面とスタイル

**Files:**
- Create: `frontend/src/components/Games/Kana/DifficultySelect.jsx`
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.css`（末尾に追加）

**Step 1: コンポーネントを書く**

`DifficultySelect.jsx`:

```jsx
import React from 'react';
import { DIFFICULTIES } from './adventureConfig';

const DifficultySelect = ({ onSelect }) => (
  <div className="difficulty-select">
    <div className="difficulty-title">むずかしさを えらんでね</div>
    <div className="difficulty-list">
      {Object.entries(DIFFICULTIES).map(([key, difficulty]) => (
        <button key={key} className="difficulty-btn" onClick={() => onSelect(key)}>
          <span className="difficulty-emoji">{difficulty.emoji}</span>
          <span className="difficulty-label">{difficulty.label}</span>
          <span className="difficulty-hearts">{'❤️'.repeat(difficulty.hearts)}</span>
        </button>
      ))}
    </div>
  </div>
);

export default DifficultySelect;
```

**Step 2: CSS を末尾に追加する**

`KanaAdventureGame.css` の末尾に追加する。

```css
/* ===== 難易度選択 ===== */
.difficulty-select {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  padding: 16px;
}

.difficulty-title {
  font-size: 2rem;
  font-weight: bold;
  color: #37474F;
}

.difficulty-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: min(420px, 100%);
}

.difficulty-btn {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  border: 4px solid #FFFFFF;
  border-radius: 24px;
  background: #FFF8E1;
  font-family: inherit;
  cursor: pointer;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.15);
}

.difficulty-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.15);
}

.difficulty-emoji {
  font-size: 2.5rem;
}

.difficulty-label {
  font-size: 1.8rem;
  font-weight: bold;
  color: #5D4037;
  flex: 1;
  text-align: left;
}

.difficulty-hearts {
  font-size: 1rem;
}

/* ===== ハート表示 ===== */
.hearts-bar {
  position: absolute;
  top: 12px;
  left: 16px;
  z-index: 5;
  display: flex;
  gap: 4px;
  font-size: 1.8rem;
}

/* ===== 音声ボタン ===== */
.speak-btn {
  font-size: 3rem;
  padding: 12px 28px;
  border: 4px solid #FFFFFF;
  border-radius: 50%;
  background: #E1F5FE;
  cursor: pointer;
  box-shadow: 0 6px 0 rgba(0, 0, 0, 0.15);
}

.speak-btn:active {
  transform: translateY(4px);
  box-shadow: 0 2px 0 rgba(0, 0, 0, 0.15);
}

/* ===== 結果ボタン ===== */
.result-buttons {
  display: flex;
  gap: 16px;
  margin-top: 20px;
  flex-wrap: wrap;
  justify-content: center;
}
```

**Step 3: 構文を確認する**

Run: `cd frontend && npx eslint src/components/Games/Kana/DifficultySelect.jsx`
Expected: エラーなし

**Step 4: コミット**

```bash
git add frontend/src/components/Games/Kana/DifficultySelect.jsx frontend/src/components/Games/Kana/KanaAdventureGame.css
git commit -m "feat: 難易度選択画面とハート・音声ボタンのスタイルを追加"
```

---

### Task 6: KanaAdventureGame の組み替え

`KanaAdventureGame.jsx` を、難易度選択・ハート制・音声出題・再出題に対応させる。マップの描画（雲・山・道・ステージ）は残すが、再出題で問題数が増えるため、道の高さを問題数から計算する。

**Files:**
- Modify (全面書き換え): `frontend/src/components/Games/Kana/KanaAdventureGame.jsx`
- Modify: `frontend/src/components/Games/Kana/KanaAdventureGame.css:35-37`（`.adventure-path-container` の固定 `min-height: 1650px` を外す）

**Step 1: CSS の固定高さを外す**

`.adventure-path-container` の `min-height: 1650px;` の行を削除する（高さは JSX から `style` で渡す）。

**Step 2: コンポーネントを書き換える**

`KanaAdventureGame.jsx` を次の内容にする。

```jsx
import React, { useState, useEffect, useRef } from 'react';
import './KanaAdventureGame.css';
import { hiraganaGroups } from '../../../data/hiraganaData';
import { katakanaGroups } from '../../../data/katakanaData';
import { playOK1Sound, playWrongSound, playHappy1Sound } from '../../../utils/soundPlayer';
import { triggerConfetti } from '../../../utils/confettiEffect';
import { speak, isSpeechAvailable, warmUpVoices } from '../../../utils/speech';
import { getDifficulty } from './adventureConfig';
import {
  generateQuestions,
  buildQuestion,
  insertRetry,
  resolveType,
  countScoredQuestions,
} from './questionGenerator';
import DifficultySelect from './DifficultySelect';

const NODE_HEIGHT = 140;
const PATH_PADDING_TOP = 100;
const PATH_PADDING_BOTTOM = 150;
const FEEDBACK_MS = 1000;

const KanaAdventureGame = ({ onClose, type }) => {
  const [screen, setScreen] = useState('select'); // 'select', 'playing', 'result', 'failed'
  const [difficulty, setDifficulty] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [hearts, setHearts] = useState(0);
  const [weakIds, setWeakIds] = useState([]); // セッション内で間違えた文字
  const [feedback, setFeedback] = useState(null); // 'correct', 'incorrect'
  const [selectedOption, setSelectedOption] = useState(null);
  const [speechAvailable, setSpeechAvailable] = useState(false);

  const activeStageRef = useRef(null);
  const timerRef = useRef(null);

  const dataGroups = type === 'katakana' ? katakanaGroups : hiraganaGroups;
  const allChars = dataGroups.flatMap((g) => g.characters);

  // 音声一覧の読み込みを先に始め、タイマーは破棄時に止める
  useEffect(() => {
    warmUpVoices();
    return () => clearTimeout(timerRef.current);
  }, []);

  // ひらがな/カタカナが切り替わったら難易度選択に戻る
  useEffect(() => {
    clearTimeout(timerRef.current);
    setScreen('select');
  }, [type]);

  const currentQuestion = questions[currentIndex];
  const currentType = currentQuestion ? resolveType(currentQuestion.type, speechAvailable) : null;

  // 現在のステージへ自動スクロール
  useEffect(() => {
    if (activeStageRef.current) {
      activeStageRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex, screen]);

  // 音声出題は、問題が表示されたら自動で読み上げる
  useEffect(() => {
    if (screen === 'playing' && currentType === 'sound-to-char') {
      speak(currentQuestion.target.char, () => setSpeechAvailable(false));
    }
  }, [screen, currentIndex, currentType]);

  const startGame = (difficultyKey) => {
    clearTimeout(timerRef.current);
    setDifficulty(difficultyKey);
    setQuestions(generateQuestions({ chars: allChars, difficulty: difficultyKey, weakIds }));
    setCurrentIndex(0);
    setScore(0);
    setHearts(getDifficulty(difficultyKey).hearts);
    setFeedback(null);
    setSelectedOption(null);
    setSpeechAvailable(isSpeechAvailable());
    setScreen('playing');
  };

  const finishGame = (cleared) => {
    if (cleared) {
      setScreen('result');
      playHappy1Sound();
      triggerConfetti();
    } else {
      setScreen('failed');
    }
  };

  const handleAnswer = (option) => {
    if (feedback) return; // 連打防止

    const isCorrect = option.id === currentQuestion.target.id;
    setSelectedOption(option);

    let nextHearts = hearts;
    let nextQuestions = questions;

    if (isCorrect) {
      playOK1Sound();
      setFeedback('correct');
      if (!currentQuestion.isRetry) setScore((s) => s + 1);
    } else {
      playWrongSound();
      setFeedback('incorrect');
      nextHearts = hearts - 1;
      setHearts(nextHearts);
      setWeakIds((ids) => (ids.includes(currentQuestion.target.id) ? ids : [...ids, currentQuestion.target.id]));
      // 再出題は1回まで（再出題で間違えても、さらには差し込まない）
      if (!currentQuestion.isRetry) {
        const retryQuestion = buildQuestion({
          target: currentQuestion.target,
          chars: allChars,
          difficulty,
          isRetry: true,
        });
        nextQuestions = insertRetry({ questions, currentIndex, retryQuestion });
        setQuestions(nextQuestions);
      }
    }

    timerRef.current = setTimeout(() => {
      setFeedback(null);
      setSelectedOption(null);

      if (nextHearts <= 0) {
        finishGame(false);
      } else if (currentIndex < nextQuestions.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        finishGame(true);
      }
    }, FEEDBACK_MS);
  };

  const renderPrompt = (question, questionType) => {
    if (questionType === 'sound-to-char') {
      return (
        <button
          className="speak-btn"
          onClick={() => speak(question.target.char, () => setSpeechAvailable(false))}
          aria-label="もういちど きく"
        >
          🔊
        </button>
      );
    }
    return questionType === 'char-to-romaji' ? question.target.char : question.target.romaji;
  };

  const renderResultOverlay = (title, emoji) => (
    <div className="adventure-result-overlay">
      <div className="result-title">{title}</div>
      <div className="winner-emoji" style={{ fontSize: '6rem', marginBottom: '1rem' }}>{emoji}</div>
      <div className="result-score">
        スコア: {score} / {countScoredQuestions(questions)}
      </div>
      <div className="result-buttons">
        <button className="game-button" onClick={() => startGame(difficulty)}>
          もう一度挑戦
        </button>
        <button className="game-button" onClick={() => setScreen('select')}>
          むずかしさを かえる
        </button>
      </div>
    </div>
  );

  if (screen === 'select') {
    return (
      <div className="kana-adventure-game">
        <div className="mountain-bg" />
        <DifficultySelect onSelect={startGame} />
      </div>
    );
  }

  const maxHearts = getDifficulty(difficulty).hearts;
  const pathHeight = PATH_PADDING_TOP + questions.length * NODE_HEIGHT + PATH_PADDING_BOTTOM;

  return (
    <div className="kana-adventure-game">
      {/* Background Layer */}
      <div className="mountain-bg">
        <div className="cloud-decoration" style={{ top: '10%', width: '100px', height: '60px', left: '-120px', animationDelay: '0s' }}></div>
        <div className="cloud-decoration" style={{ top: '30%', width: '150px', height: '90px', left: '-200px', animationDelay: '5s' }}></div>
        <div className="cloud-decoration" style={{ top: '60%', width: '120px', height: '70px', left: '-150px', animationDelay: '10s' }}></div>
        <div className="cloud-decoration" style={{ top: '80%', width: '180px', height: '100px', left: '-220px', animationDelay: '2s' }}></div>
      </div>

      {/* ハート表示 */}
      <div className="hearts-bar">
        {Array.from({ length: maxHearts }, (_, i) => (
          <span key={i}>{i < hearts ? '❤️' : '🤍'}</span>
        ))}
      </div>

      {/* Scrollable Map Area */}
      <div className="adventure-scroll-container">
        <div className="adventure-path-container" style={{ minHeight: `${pathHeight}px` }}>
          <svg className="winding-path-svg" viewBox={`0 0 100 ${pathHeight}`} preserveAspectRatio="none">
            <path
              d={`M 50 ${pathHeight}
                  ${questions
                    .map((_, i) => {
                      // ステージ0の中心 = 全体の高さ - 下の余白 - ノード高さの半分
                      const y = pathHeight - PATH_PADDING_BOTTOM - NODE_HEIGHT / 2 - i * NODE_HEIGHT;
                      const x = i % 2 === 0 ? 20 : 80; // Left(20), Right(80)
                      return `L ${x} ${y}`;
                    })
                    .join(' ')}`}
              fill="none"
              stroke="#8D6E63"
              strokeWidth="3"
              strokeDasharray="15, 10"
            />
          </svg>

          {/* ステージ描画（CSS の column-reverse で下から上に並ぶ） */}
          {questions.map((q, idx) => {
            const isActive = idx === currentIndex && screen === 'playing';
            const isCleared = idx < currentIndex;
            const isLocked = idx > currentIndex;
            const positionClass = idx % 2 === 0 ? 'left' : 'right';
            const questionType = resolveType(q.type, speechAvailable);

            return (
              <div
                key={idx}
                className={`stage-node ${positionClass} ${isActive ? 'active' : ''} ${isCleared ? 'cleared' : ''} ${isLocked ? 'locked' : ''}`}
                ref={isActive ? activeStageRef : null}
              >
                <div className="stage-content">
                  {isActive ? (
                    <div className="quiz-active-container">
                      <div className="quiz-header-simple">
                        {q.isRetry ? 'もういちど！' : `もんだい ${idx + 1}`}
                      </div>

                      <div className="quiz-question-text">{renderPrompt(q, questionType)}</div>

                      <div className="quiz-options-grid">
                        {q.options.map((opt, optIdx) => {
                          const isSelected = selectedOption === opt;
                          const isCorrect = opt.id === q.target.id;
                          const optionText = questionType === 'char-to-romaji' ? opt.romaji : opt.char;
                          let btnClass = 'quiz-option-btn';

                          if (feedback) {
                            if (isCorrect) btnClass += ' correct';
                            else if (isSelected) btnClass += ' incorrect';
                          }

                          return (
                            <button
                              key={optIdx}
                              className={btnClass}
                              onClick={() => handleAnswer(opt)}
                              disabled={!!feedback}
                            >
                              {optionText}
                            </button>
                          );
                        })}
                      </div>

                      <div className="player-avatar">🦁</div>
                    </div>
                  ) : isCleared ? (
                    <div className="stage-marker">🚩</div>
                  ) : (
                    <div className="stage-marker">🔒</div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {screen === 'result' && renderResultOverlay('冒険クリア！', '🏔️🎉')}
      {screen === 'failed' && renderResultOverlay('ざんねん…', '😢')}
    </div>
  );
};

export default KanaAdventureGame;
```

**Step 3: ビルドと lint を確認する**

Run: `cd frontend && npx eslint src/components/Games/Kana && npx vite build 2>&1 | tail -5`
Expected: 今回追加・変更したファイルに新しいエラーがない / `built in ...` が表示される

**Step 4: 全テストを実行する**

Run: `cd frontend && npx vitest run`
Expected: PASS（全テスト）

**Step 5: コミット**

```bash
git add frontend/src/components/Games/Kana/KanaAdventureGame.jsx frontend/src/components/Games/Kana/KanaAdventureGame.css
git commit -m "feat: かな冒険クイズに難易度選択・ハート制・音声出題・再出題を組み込み"
```

---

### Task 7: 手動確認（ブラウザ）

開発サーバー（http://localhost:5174/）で、かな冒険クイズを開いて確認する。ログインが必要なので、アカウントがなければ登録する。

**確認項目**

1. **難易度選択**: ゲームを開くと「むずかしさを えらんでね」と 3 つのボタンが出る。
2. **やさしい**: ハートが 5 つ、選択肢が 3 つ。問題表示時に音声が読み上げられ、🔊 で再生できる。
3. **ふつう**: ハートが 3 つ、選択肢が 4 つ。音声問題と「文字→ローマ字」問題が混ざる。
4. **むずかしい**: ハートが 2 つ。ローマ字問題も出る。
5. **ハート**: 間違えるとハートが 1 つ減る（🤍 になる）。0 になると「ざんねん…」が出る。
6. **再出題**: 間違えると 2〜3 問後に「もういちど！」が出る。再出題で正解してもスコアは増えず、母数（`/ 10`）も増えない。
7. **結果画面**: 「もう一度挑戦」で同じ難易度、「むずかしさを かえる」で難易度選択に戻る。もう一度挑戦では、さっき間違えた文字が出やすい。
8. **カタカナ**: カタカナのゲームでも同様に動く。
9. **音声なしのフォールバック**: ブラウザの音声が使えない場合（または日本語音声がない場合）、音声問題が「ローマ字→文字」に置き換わり、ゲームが続けられる。
10. **コンソール**: 想定外のエラーが出ていない（音声失敗時の `console.warn` は想定内）。

不具合が見つかった場合は、原因を調べて修正し、`fix:` のコミットを追加する。3 回試しても直らない場合は、そこで止めて報告する。

**Step 最終: 全体確認とコミット**

Run: `cd frontend && npx vitest run && npx vite build 2>&1 | tail -3`
Expected: 全テスト PASS、ビルド成功

```bash
git status --short   # 未コミットの変更がないことを確認
```

---

## 完了条件（Definition of Done）

- [ ] `npx vitest run` が全て通る
- [ ] `npx vite build` が成功する
- [ ] 今回触ったファイルに lint の新しい警告がない
- [ ] Task 7 の手動確認項目がすべて OK
- [ ] 各 Task がコミットされている
- [ ] 設計書（`2026-10-31-kana-adventure-stage1-design.md`）と実装が一致している
