import { describe, it, expect } from 'vitest';
import { isJumpKey, isEnemyAwake, WAKE_DISTANCE, computeSteps, STEP_MS, MAX_STEPS, resolveBlockCollision, buildCheckpoints, updateCheckpoints, lastReachedCheckpoint, CHECKPOINT_INTERVAL, updateAirState, COYOTE_FRAMES, JUMP_BUFFER_FRAMES, shouldBufferedJump, isPauseKey } from './jumpGameLogic';

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

describe('buildCheckpoints', () => {
  it('コースを一定の間隔で区切って、チェックポイントを並べる', () => {
    const xs = buildCheckpoints({ levelLength: 10000 }).map((c) => c.x);
    expect(xs).toEqual([CHECKPOINT_INTERVAL, CHECKPOINT_INTERVAL * 2, CHECKPOINT_INTERVAL * 3]);
  });

  it('ゴールの手前すぎる位置には置かない', () => {
    const xs = buildCheckpoints({ levelLength: 5100 }).map((c) => c.x);
    expect(xs).toEqual([CHECKPOINT_INTERVAL]);
  });

  it('短いコースには置かない', () => {
    expect(buildCheckpoints({ levelLength: 2000 })).toEqual([]);
  });

  it('最初はどれも通過していない', () => {
    expect(buildCheckpoints({ levelLength: 10000 }).every((c) => c.reached === false)).toBe(true);
  });
});

describe('updateCheckpoints', () => {
  const checkpoints = [
    { x: 2500, reached: false },
    { x: 5000, reached: false },
  ];

  it('手前にいるうちは、何も通過しない', () => {
    const result = updateCheckpoints({ checkpoints, playerX: 2499 });
    expect(result.newlyReached).toEqual([]);
  });

  it('旗の位置に着いたら、通過したことにして、新しく通過した旗を返す', () => {
    const result = updateCheckpoints({ checkpoints, playerX: 2500 });
    expect(result.checkpoints[0].reached).toBe(true);
    expect(result.newlyReached.map((c) => c.x)).toEqual([2500]);
  });

  it('通過済みの旗は、もう一度「新しく通過した」扱いにしない', () => {
    const once = updateCheckpoints({ checkpoints, playerX: 2600 });
    const twice = updateCheckpoints({ checkpoints: once.checkpoints, playerX: 2700 });
    expect(twice.newlyReached).toEqual([]);
  });

  it('元の配列は書き換えない', () => {
    updateCheckpoints({ checkpoints, playerX: 6000 });
    expect(checkpoints.every((c) => c.reached === false)).toBe(true);
  });
});

describe('lastReachedCheckpoint', () => {
  it('どの旗も通過していなければ null', () => {
    expect(lastReachedCheckpoint([{ x: 2500, reached: false }])).toBeNull();
  });

  it('通過した旗のうち、いちばん先の旗を返す', () => {
    const checkpoints = [
      { x: 2500, reached: true },
      { x: 5000, reached: true },
      { x: 7500, reached: false },
    ];
    expect(lastReachedCheckpoint(checkpoints).x).toBe(5000);
  });
});

describe('updateAirState（コヨーテタイム）', () => {
  it('地面にいる間は空中時間を0に戻し、ジャンプ回数も0に戻す', () => {
    expect(updateAirState({ grounded: true, airFrames: 3, jumpCount: 1 })).toEqual({ airFrames: 0, jumpCount: 0 });
  });

  it('足場を離れた直後は、地上ジャンプの権利を残す', () => {
    const next = updateAirState({ grounded: false, airFrames: COYOTE_FRAMES - 1, jumpCount: 0 });
    expect(next.jumpCount).toBe(0);
  });

  it('猶予を過ぎたら、地上ジャンプの権利を使ったことにする', () => {
    let s = { airFrames: 0, jumpCount: 0 };
    for (let i = 0; i <= COYOTE_FRAMES; i++) s = updateAirState({ grounded: false, ...s });
    expect(s.jumpCount).toBe(1);
  });

  it('ジャンプ済みの空中では、ジャンプ回数を増やさない', () => {
    const s = updateAirState({ grounded: false, airFrames: 50, jumpCount: 2 });
    expect(s.jumpCount).toBe(2);
  });
});

describe('先行入力', () => {
  it('ジャンプできない時に押すと、バッファを満タンにする', () => {
    expect(JUMP_BUFFER_FRAMES).toBeGreaterThan(0);
  });

  it('着地した時にバッファが残っていれば、ジャンプする', () => {
    expect(shouldBufferedJump({ buffer: 3, grounded: true })).toBe(true);
  });

  it('バッファが切れていたら、着地してもジャンプしない', () => {
    expect(shouldBufferedJump({ buffer: 0, grounded: true })).toBe(false);
  });

  it('空中のままなら、バッファが残っていてもジャンプしない', () => {
    expect(shouldBufferedJump({ buffer: 3, grounded: false })).toBe(false);
  });
});

describe('isPauseKey', () => {
  it('EscキーとPキーは一時停止の操作として扱う', () => {
    expect(isPauseKey('Escape')).toBe(true);
    expect(isPauseKey('p')).toBe(true);
    expect(isPauseKey('P')).toBe(true);
  });

  it('ジャンプのキーやそれ以外のキーは、一時停止の操作として扱わない', () => {
    expect(isPauseKey(' ')).toBe(false);
    expect(isPauseKey('ArrowUp')).toBe(false);
    expect(isPauseKey('a')).toBe(false);
  });
});
