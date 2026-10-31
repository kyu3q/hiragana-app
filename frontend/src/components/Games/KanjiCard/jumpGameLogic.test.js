import { describe, it, expect } from 'vitest';
import { isJumpKey, isEnemyAwake, WAKE_DISTANCE, computeSteps, STEP_MS, MAX_STEPS } from './jumpGameLogic';

describe('isJumpKey', () => {
  it('スペースキーはジャンプ操作として扱う', () => {
    expect(isJumpKey(' ')).toBe(true);
  });

  it('↑キーとWキーもジャンプ操作として扱う', () => {
    expect(isJumpKey('ArrowUp')).toBe(true);
    expect(isJumpKey('w')).toBe(true);
    expect(isJumpKey('W')).toBe(true);
  });

  it('それ以外のキーはジャンプ操作として扱わない', () => {
    expect(isJumpKey('a')).toBe(false);
    expect(isJumpKey('Enter')).toBe(false);
    expect(isJumpKey('ArrowDown')).toBe(false);
  });
});

describe('isEnemyAwake', () => {
  it('プレイヤーから遠い敵は動き出さない', () => {
    expect(isEnemyAwake({ enemyX: 5000, playerX: 100 })).toBe(false);
  });

  it('画面に近づいた敵は動き出す', () => {
    expect(isEnemyAwake({ enemyX: 100 + WAKE_DISTANCE, playerX: 100 })).toBe(true);
  });

  it('動き出す距離のすぐ外側ではまだ動かない', () => {
    expect(isEnemyAwake({ enemyX: 100 + WAKE_DISTANCE + 1, playerX: 100 })).toBe(false);
  });

  it('プレイヤーを追い越した敵も動いたままにする', () => {
    expect(isEnemyAwake({ enemyX: -50, playerX: 100 })).toBe(true);
  });
});

describe('computeSteps', () => {
  // 画面の更新間隔を変えて、1秒間に進める更新回数を数える
  const countStepsPerSecond = (frameMs) => {
    let accumulatorMs = 0;
    let total = 0;
    for (let t = 0; t < 1000; t += frameMs) {
      const result = computeSteps({ accumulatorMs, deltaMs: frameMs });
      accumulatorMs = result.accumulatorMs;
      total += result.steps;
    }
    return total;
  };

  it('60Hzの画面では1フレームで1回更新する', () => {
    expect(computeSteps({ accumulatorMs: 0, deltaMs: STEP_MS }).steps).toBe(1);
  });

  it('更新間隔に満たない時間は、更新せずに持ち越す', () => {
    const result = computeSteps({ accumulatorMs: 0, deltaMs: 8 });
    expect(result.steps).toBe(0);
    expect(result.accumulatorMs).toBeCloseTo(8);
  });

  it('60Hzと120Hzの画面で、1秒間の更新回数がほぼ同じになる', () => {
    expect(Math.abs(countStepsPerSecond(1000 / 60) - countStepsPerSecond(1000 / 120))).toBeLessThanOrEqual(1);
  });

  it('1秒間の更新回数は60回になる（144Hzの画面でも）', () => {
    expect(Math.abs(countStepsPerSecond(1000 / 144) - 60)).toBeLessThanOrEqual(1);
  });

  it('タブを開き直したときなど、長い空白があっても更新回数を上限で止める', () => {
    expect(computeSteps({ accumulatorMs: 0, deltaMs: 5000 }).steps).toBe(MAX_STEPS);
  });

  it('上限で止めたときは、溜まった時間を捨てて高速で追いつかない', () => {
    expect(computeSteps({ accumulatorMs: 0, deltaMs: 5000 }).accumulatorMs).toBeLessThan(STEP_MS);
  });
});
