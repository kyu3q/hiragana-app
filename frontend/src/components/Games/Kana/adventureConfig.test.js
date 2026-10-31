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
