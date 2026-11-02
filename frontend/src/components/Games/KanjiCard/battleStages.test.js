import { describe, it, expect } from 'vitest';
import { BATTLE_STAGES, buildOptions, pickDamage } from './battleStages';

describe('BATTLE_STAGES', () => {
  it('もりのスライム・やみのおおかみ・ドラゴンのしろの3ステージがこの順で並ぶ', () => {
    expect(BATTLE_STAGES.map((s) => s.name)).toEqual(['もりのスライム', 'やみのおおかみ', 'ドラゴンのしろ']);
  });

  it('最初のステージは、今までと同じ（敵HP100・選択肢4つ・時間制限なし）', () => {
    expect(BATTLE_STAGES[0].enemyHp).toBe(100);
    expect(BATTLE_STAGES[0].optionCount).toBe(4);
    expect(BATTLE_STAGES[0].timeLimit).toBeNull();
  });

  it('進むほど、敵のHPが増える', () => {
    for (let i = 1; i < BATTLE_STAGES.length; i++) {
      expect(BATTLE_STAGES[i].enemyHp).toBeGreaterThan(BATTLE_STAGES[i - 1].enemyHp);
    }
  });

  it('進むほど、選択肢が増えるか同じ数で、最後は最初より多い', () => {
    for (let i = 1; i < BATTLE_STAGES.length; i++) {
      expect(BATTLE_STAGES[i].optionCount).toBeGreaterThanOrEqual(BATTLE_STAGES[i - 1].optionCount);
    }
    expect(BATTLE_STAGES[2].optionCount).toBeGreaterThan(BATTLE_STAGES[0].optionCount);
  });

  it('時間制限は、2ステージ目以降にあり、進むほど短い', () => {
    expect(BATTLE_STAGES[1].timeLimit).toBeGreaterThan(0);
    expect(BATTLE_STAGES[2].timeLimit).toBeLessThan(BATTLE_STAGES[1].timeLimit);
  });

  it('どのステージも、名前・背景・敵の絵文字がそろっている', () => {
    BATTLE_STAGES.forEach((s) => {
      expect(s.name).toBeTruthy();
      expect(s.background).toHaveLength(2);
      expect(s.enemyEmoji).toBeTruthy();
    });
  });

  it('選択肢の数は、2列の画面に並ぶ偶数である', () => {
    BATTLE_STAGES.forEach((s) => expect(s.optionCount % 2).toBe(0));
  });
});

describe('buildOptions', () => {
  const rng = () => 0.3;

  it('正解が1つだけ入り、全体で指定した数になる', () => {
    const options = buildOptions({ targetChar: '日', similarChars: '目白百田', count: 6, rng });
    expect(options).toHaveLength(6);
    expect(options.filter((o) => o.isCorrect)).toHaveLength(1);
    expect(options.find((o) => o.isCorrect).char).toBe('日');
  });

  it('似た漢字が足りるときは、まちがいの選択肢が重ならない', () => {
    const options = buildOptions({ targetChar: '日', similarChars: '目白百田', count: 4, rng });
    const wrong = options.filter((o) => !o.isCorrect).map((o) => o.char);
    expect(new Set(wrong).size).toBe(3);
    wrong.forEach((c) => expect('目白百田').toContain(c));
  });

  it('似た漢字が足りないときは、ふつうの漢字でうめる（正解と同じ字は入らない）', () => {
    const options = buildOptions({ targetChar: '日', similarChars: '目', count: 6, rng });
    expect(options).toHaveLength(6);
    expect(options.filter((o) => o.char === '日')).toHaveLength(1);
  });

  it('似た漢字がないとき（undefined）でも作れる', () => {
    const options = buildOptions({ targetChar: '漢', similarChars: undefined, count: 4, rng });
    expect(options).toHaveLength(4);
  });
});

describe('pickDamage', () => {
  it('こうげきは20〜29、うけるダメージは15〜24', () => {
    expect(pickDamage({ kind: 'attack', r: 0 })).toBe(20);
    expect(pickDamage({ kind: 'attack', r: 0.99 })).toBe(29);
    expect(pickDamage({ kind: 'hit', r: 0 })).toBe(15);
    expect(pickDamage({ kind: 'hit', r: 0.99 })).toBe(24);
  });
});
