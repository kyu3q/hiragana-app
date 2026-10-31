// 漢字ランナー（JumpGame）の判定ロジック。画面や canvas に依存しない純粋関数だけを置く。

const JUMP_KEYS = [' ', 'ArrowUp', 'w', 'W'];

// ジャンプ操作として扱うキーか
export const isJumpKey = (key) => JUMP_KEYS.includes(key);

// 敵が動き出す距離。画面の右端（カメラはプレイヤーの150px左）より少し先
export const WAKE_DISTANCE = 800;

// 敵が動いてよいか。プレイヤーに近づいた敵と、すでに追い越した敵は動かす
export const isEnemyAwake = ({ enemyX, playerX }) => enemyX - playerX <= WAKE_DISTANCE;
