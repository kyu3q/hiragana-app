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
