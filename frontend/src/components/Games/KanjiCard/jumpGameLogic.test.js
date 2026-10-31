import { describe, it, expect } from 'vitest';
import { isJumpKey, isEnemyAwake, WAKE_DISTANCE, computeSteps, STEP_MS, MAX_STEPS, resolveBlockCollision } from './jumpGameLogic';

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

describe('resolveBlockCollision', () => {
  const SIZE = 40;
  const block = { x: 300, y: 340, w: 80, h: 40 }; // 下端は y=380

  const resolve = (player, intendedMove = 3.5) =>
    resolveBlockCollision({ player, size: SIZE, intendedMove, block });

  it('ブロックに重なっていなければ、何も起きない', () => {
    expect(resolve({ x: 100, y: 460, vy: 0 }).type).toBe('none');
  });

  it('上から落ちてきたら、ブロックの上に乗る', () => {
    // 前フレームの足元(y+40-vy=346)が、ブロックの上端(340)から10px以内にあった
    const result = resolve({ x: 320, y: 304 + 8, vy: 6 });
    expect(result).toEqual({ type: 'top', y: 300, vy: 0 });
  });

  it('下から跳ねて頭をぶつけたら、ブロックの下で止まって落ち始める', () => {
    // 前フレームの頭(y-vy=385)がブロックの下端(380)より下にあった
    const result = resolve({ x: 320, y: 375, vy: -10 });
    expect(result).toEqual({ type: 'ceiling', y: 380, vy: 0 });
  });

  it('横から近づいてぶつかったら、前に進めなくなる', () => {
    const result = resolve({ x: 262, y: 350, vy: 0 });
    expect(result.type).toBe('side');
    expect(result.intendedMove).toBe(0);
  });

  it('ブロックの横を上昇中のときは、頭をぶつけた扱いにしない', () => {
    // 頭が前フレームでもブロックの下端より上にあった（横から重なっているだけ）
    const result = resolve({ x: 262, y: 330, vy: -10 });
    expect(result.type).toBe('side');
  });
});
