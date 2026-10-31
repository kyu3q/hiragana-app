import { describe, it, expect } from 'vitest';
import { getDifficulty } from './adventureConfig';
import {
  generateQuestions,
  buildQuestion,
  resolveType,
  insertRetry,
  countScoredQuestions,
} from './questionGenerator';

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
