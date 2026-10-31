import { describe, it, expect } from 'vitest';
import { isJumpKey, isEnemyAwake, WAKE_DISTANCE } from './jumpGameLogic';

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
