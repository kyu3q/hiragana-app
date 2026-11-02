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
