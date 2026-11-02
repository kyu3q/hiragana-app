import { describe, it, expect } from 'vitest';
import { STAGES, ITEM_ORDER, pickItemType } from './airplaneStages';

describe('飛行機の STAGES', () => {
  it('あおぞら・くものうえ・よぞらの3ステージがこの順で並ぶ', () => {
    expect(STAGES.map((s) => s.id)).toEqual(['bluesky', 'aboveclouds', 'nightsky']);
    expect(STAGES.map((s) => s.name)).toEqual(['あおぞら', 'くものうえ', 'よぞら']);
  });

  it('ステージ1は、今までのゲームと同じ値', () => {
    const s = STAGES[0];
    expect(s.scrollSpeed).toBe(4);
    expect(s.levelLength).toBe(3000);
    expect(s.spawnRate).toBe(0.02);
    expect(s.weights).toEqual({ good: 0.5, bad: 0.25, obstacle: 0.15, coin: 0.1 });
    expect(s.theme.sky).toEqual(['#4FC3F7', '#E1F5FE']);
    expect(s.theme.cloud).toBe('rgba(255, 255, 255, 0.7)');
    expect(s.theme.stars).toBe(false);
    expect(s.obstacleSkin).toBeNull();
  });

  it('進むほど、飛ぶ速さが上がる', () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].scrollSpeed).toBeGreaterThan(STAGES[i - 1].scrollSpeed);
    }
  });

  it('進むほど、障害物が出る頻度が上がる', () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].spawnRate).toBeGreaterThan(STAGES[i - 1].spawnRate);
    }
  });

  it('進むほど、障害物の割合が増える', () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].weights.obstacle).toBeGreaterThan(STAGES[i - 1].weights.obstacle);
    }
  });

  it('進むほど、コースが長くなる', () => {
    for (let i = 1; i < STAGES.length; i++) {
      expect(STAGES[i].levelLength).toBeGreaterThan(STAGES[i - 1].levelLength);
    }
  });

  it('どのステージも、アイテムの割合の合計が1になる', () => {
    STAGES.forEach((s) => {
      const total = ITEM_ORDER.reduce((sum, key) => sum + s.weights[key], 0);
      expect(total).toBeCloseTo(1, 10);
    });
  });

  it('どのステージも、見た目の設定がそろっている', () => {
    STAGES.forEach((s) => {
      expect(s.theme.sky).toHaveLength(2);
      expect(s.theme.cloud).toBeTruthy();
      expect(typeof s.theme.stars).toBe('boolean');
    });
  });

  it('ステージ1以外は、障害物の見た目（絵文字）がそろっている', () => {
    STAGES.slice(1).forEach((s) => {
      expect(Object.keys(s.obstacleSkin).sort()).toEqual(['bird', 'storm']);
    });
  });

  it('よぞらだけ、星が出る', () => {
    expect(STAGES.map((s) => s.theme.stars)).toEqual([false, false, true]);
  });
});

describe('pickItemType', () => {
  const w = STAGES[0].weights;

  it('ステージ1の割合は、今までの割合（0.5 / 0.75 / 0.9）と同じ', () => {
    expect(pickItemType({ weights: w, r: 0.3 })).toBe('good');
    expect(pickItemType({ weights: w, r: 0.6 })).toBe('bad');
    expect(pickItemType({ weights: w, r: 0.8 })).toBe('obstacle');
    expect(pickItemType({ weights: w, r: 0.95 })).toBe('coin');
  });

  it('境目ちょうどの値は、次の種類になる', () => {
    expect(pickItemType({ weights: w, r: 0.5 })).toBe('bad');
  });
});
