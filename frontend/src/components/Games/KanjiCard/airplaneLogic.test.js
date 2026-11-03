import { describe, it, expect } from 'vitest';
import {
  isThrustKey,
  CHECKPOINT_INTERVAL,
  RESPAWN_FUEL,
  RESPAWN_INVINCIBLE,
  buildCheckpoints,
  updateCheckpoints,
  lastReachedCheckpoint,
  respawnAt,
  comboMultiplier,
  comboScore,
  hitPenalty,
  COMBO_FRAMES,
} from './airplaneLogic';
import { STAGES } from './airplaneStages';

describe('isThrustKey', () => {
  it('スペース・↑・W で上昇できる', () => {
    [' ', 'ArrowUp', 'w', 'W'].forEach((key) => expect(isThrustKey(key)).toBe(true));
  });

  it('それ以外のキーでは上昇しない', () => {
    ['Enter', 'ArrowDown', 'a', 'Escape'].forEach((key) => expect(isThrustKey(key)).toBe(false));
  });
});

describe('buildCheckpoints', () => {
  it('一定の間隔で旗を置き、最初は未通過になる', () => {
    const checkpoints = buildCheckpoints({ levelLength: 3000 });
    expect(checkpoints.map((c) => c.distance)).toEqual([CHECKPOINT_INTERVAL, CHECKPOINT_INTERVAL * 2]);
    checkpoints.forEach((c) => expect(c.reached).toBe(false));
  });

  it('ゴール直前には置かない', () => {
    STAGES.forEach((stage) => {
      buildCheckpoints({ levelLength: stage.levelLength }).forEach((c) => {
        expect(stage.levelLength - c.distance).toBeGreaterThanOrEqual(300);
      });
    });
  });

  it('どのステージにも、旗が1つ以上ある', () => {
    STAGES.forEach((stage) => {
      expect(buildCheckpoints({ levelLength: stage.levelLength }).length).toBeGreaterThan(0);
    });
  });
});

describe('updateCheckpoints', () => {
  const base = buildCheckpoints({ levelLength: 3600 });

  it('飛んだ距離が旗に届くと、通過済みになる', () => {
    const result = updateCheckpoints({ checkpoints: base, distance: CHECKPOINT_INTERVAL });
    expect(result.checkpoints[0].reached).toBe(true);
    expect(result.checkpoints[1].reached).toBe(false);
    expect(result.newlyReached).toHaveLength(1);
  });

  it('すでに通過した旗は、新しく通過した旗に数えない', () => {
    const first = updateCheckpoints({ checkpoints: base, distance: CHECKPOINT_INTERVAL });
    const second = updateCheckpoints({ checkpoints: first.checkpoints, distance: CHECKPOINT_INTERVAL + 10 });
    expect(second.newlyReached).toHaveLength(0);
  });

  it('元の配列は書き換えない', () => {
    updateCheckpoints({ checkpoints: base, distance: 99999 });
    base.forEach((c) => expect(c.reached).toBe(false));
  });
});

describe('lastReachedCheckpoint', () => {
  it('通過済みのうち、いちばん先の旗を返す', () => {
    const { checkpoints } = updateCheckpoints({ checkpoints: buildCheckpoints({ levelLength: 3600 }), distance: CHECKPOINT_INTERVAL * 2 });
    expect(lastReachedCheckpoint(checkpoints).distance).toBe(CHECKPOINT_INTERVAL * 2);
  });

  it('通過した旗がなければ null', () => {
    expect(lastReachedCheckpoint(buildCheckpoints({ levelLength: 3000 }))).toBeNull();
  });
});

describe('respawnAt', () => {
  it('旗の位置に戻り、燃料は決まった量、すこしの間は無敵になる', () => {
    expect(respawnAt({ distance: 2000 })).toEqual({
      distance: 2000,
      fuel: RESPAWN_FUEL,
      invincible: RESPAWN_INVINCIBLE,
    });
  });

  it('燃料は満タンではなく、すぐ切れない量', () => {
    expect(RESPAWN_FUEL).toBeGreaterThan(0);
    expect(RESPAWN_FUEL).toBeLessThan(100);
  });
});

describe('comboMultiplier', () => {
  it('コンボが5つ増えるごとに、倍率が0.5ずつ上がる（ランナーと同じ）', () => {
    expect([0, 4, 5, 9, 10, 15].map(comboMultiplier)).toEqual([1, 1, 1.5, 1.5, 2, 2.5]);
  });
});

describe('comboScore', () => {
  it('コンボなしなら、基本の点のまま', () => {
    expect(comboScore({ base: 100, combo: 0 })).toBe(100);
  });

  it('コンボ5で1.5倍になる', () => {
    expect(comboScore({ base: 100, combo: 5 })).toBe(150);
    expect(comboScore({ base: 50, combo: 5 })).toBe(75);
  });

  it('小数になるときは切り捨てる', () => {
    expect(comboScore({ base: 25, combo: 5 })).toBe(37);
  });
});

describe('hitPenalty', () => {
  it('ぶつかると50点減る', () => {
    expect(hitPenalty({ score: 300 })).toBe(50);
  });

  it('いまの点より多くは減らない（0点より下にならない）', () => {
    expect(hitPenalty({ score: 30 })).toBe(30);
    expect(hitPenalty({ score: 0 })).toBe(0);
  });
});

describe('COMBO_FRAMES', () => {
  it('コンボは3秒（180フレーム）で切れる（ランナーと同じ）', () => {
    expect(COMBO_FRAMES).toBe(180);
  });
});
