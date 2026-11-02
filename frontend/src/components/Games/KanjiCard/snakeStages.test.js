import { describe, it, expect } from 'vitest';
import { SNAKE_STAGES, SNAKE_COLS, SNAKE_ROWS, getMoveInterval, isStageGoalReached } from './snakeStages';

describe('SNAKE_STAGES', () => {
  it('はらっぱ・どうくつ・ようがんの3ステージがこの順で並ぶ', () => {
    expect(SNAKE_STAGES.map((s) => s.name)).toEqual(['はらっぱ', 'どうくつ', 'ようがん']);
  });

  it('ステージ1は今までのゲームと同じ設定（速さ250ms・下限100ms・ハズレの出やすさ0.5・障害物なし）', () => {
    const s = SNAKE_STAGES[0];
    expect(s.baseInterval).toBe(250);
    expect(s.minInterval).toBe(100);
    expect(s.badSpawnChance).toBe(0.5);
    expect(s.obstacles).toEqual([]);
  });

  it('目標点の合計は、今までの勝利条件の500点になる', () => {
    const total = SNAKE_STAGES.reduce((sum, s) => sum + s.targetScore, 0);
    expect(total).toBe(500);
  });

  it('目標点は、正解1個の50点で割り切れる', () => {
    SNAKE_STAGES.forEach((s) => expect(s.targetScore % 50).toBe(0));
  });

  it('進むほど、動く間隔が短くなる（速くなる）', () => {
    for (let i = 1; i < SNAKE_STAGES.length; i++) {
      expect(SNAKE_STAGES[i].baseInterval).toBeLessThan(SNAKE_STAGES[i - 1].baseInterval);
      expect(SNAKE_STAGES[i].minInterval).toBeLessThan(SNAKE_STAGES[i - 1].minInterval);
    }
  });

  it('進むほど、ハズレの出る割合が増える', () => {
    for (let i = 1; i < SNAKE_STAGES.length; i++) {
      expect(SNAKE_STAGES[i].badSpawnChance).toBeGreaterThan(SNAKE_STAGES[i - 1].badSpawnChance);
      expect(SNAKE_STAGES[i].badRotateMax).toBeGreaterThanOrEqual(SNAKE_STAGES[i - 1].badRotateMax);
    }
  });

  it('進むほど、障害物が増える', () => {
    for (let i = 1; i < SNAKE_STAGES.length; i++) {
      expect(SNAKE_STAGES[i].obstacles.length).toBeGreaterThan(SNAKE_STAGES[i - 1].obstacles.length);
    }
  });

  it('障害物は盤面の中にあり、重ならず、ヘビの出発点（中央と、その右の4マス）にない', () => {
    const cx = Math.floor(SNAKE_COLS / 2);
    const cy = Math.floor(SNAKE_ROWS / 2);
    SNAKE_STAGES.forEach((s) => {
      const seen = new Set();
      s.obstacles.forEach(({ x, y }) => {
        expect(x).toBeGreaterThanOrEqual(0);
        expect(x).toBeLessThan(SNAKE_COLS);
        expect(y).toBeGreaterThanOrEqual(0);
        expect(y).toBeLessThan(SNAKE_ROWS);
        expect(y === cy && x >= cx && x <= cx + 4).toBe(false);
        const key = `${x},${y}`;
        expect(seen.has(key)).toBe(false);
        seen.add(key);
      });
    });
  });

  it('どのステージも、見た目の設定がそろっている', () => {
    SNAKE_STAGES.forEach((s) => {
      expect(s.theme.textColor).toBeTruthy();
      expect(s.theme.snakeBody).toBeTruthy();
      expect(s.theme.obstacleEmoji).toBeTruthy();
      expect(s.theme.badEmoji).toBeTruthy();
      expect(s.theme.heartEmoji).toBeTruthy();
    });
  });
});

describe('getMoveInterval', () => {
  it('ステージ1は、今までと同じ式（250msから、50点ごとに10ms短く、下限100ms）', () => {
    const s = SNAKE_STAGES[0];
    expect(getMoveInterval(s, 0)).toBe(250);
    expect(getMoveInterval(s, 49)).toBe(250);
    expect(getMoveInterval(s, 50)).toBe(240);
    expect(getMoveInterval(s, 10000)).toBe(100);
  });

  it('下限より短くならない', () => {
    SNAKE_STAGES.forEach((s) => expect(getMoveInterval(s, 100000)).toBe(s.minInterval));
  });

  it('同じ増分なら、進んだステージのほうが速い', () => {
    for (let i = 1; i < SNAKE_STAGES.length; i++) {
      expect(getMoveInterval(SNAKE_STAGES[i], 100)).toBeLessThan(getMoveInterval(SNAKE_STAGES[i - 1], 100));
    }
  });
});

describe('isStageGoalReached', () => {
  const stage = SNAKE_STAGES[1];

  it('開始時点からの増分が目標点に届いたら、達成', () => {
    expect(isStageGoalReached(stage, 150 + stage.targetScore, 150)).toBe(true);
  });

  it('目標点に届かないうちは、達成ではない', () => {
    expect(isStageGoalReached(stage, 150 + stage.targetScore - 50, 150)).toBe(false);
  });

  it('引き継いだスコアが大きくても、増分が足りなければ達成ではない', () => {
    expect(isStageGoalReached(stage, 500, 500)).toBe(false);
  });
});
