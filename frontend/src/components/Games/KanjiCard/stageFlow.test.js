import { describe, it, expect } from 'vitest';
import { isLastStage, stageTitle, stageProgress, nextStageStart, retryStageStart } from './stageFlow';

const stages = [{ name: 'はらっぱ' }, { name: 'どうくつ' }, { name: 'ようがん' }];

describe('isLastStage', () => {
  it('最後のステージだけ true になる', () => {
    expect(stages.map((_, i) => isLastStage(stages, i))).toEqual([false, false, true]);
  });
});

describe('stageTitle', () => {
  it('番号と名前の間は、全角スペースで区切る', () => {
    expect(stageTitle(stages, 1)).toBe('ステージ2　どうくつ');
  });
});

describe('stageProgress', () => {
  it('いまの番号と全体の数を「1/3」の形で返す', () => {
    expect(stageProgress(stages, 0)).toBe('1/3');
    expect(stageProgress(stages, 2)).toBe('3/3');
  });
});

describe('nextStageStart', () => {
  it('次のステージへ進み、いまのスコアを引き継いで、名前を出す', () => {
    expect(nextStageStart({ index: 0, score: 120 })).toEqual({ index: 1, startScore: 120, withIntro: true });
  });
});

describe('retryStageStart', () => {
  it('同じステージの最初に戻り、スコアはそのステージの開始時点に戻して、名前は出さない', () => {
    expect(retryStageStart({ index: 1, startScore: 120 })).toEqual({ index: 1, startScore: 120, withIntro: false });
  });
});
