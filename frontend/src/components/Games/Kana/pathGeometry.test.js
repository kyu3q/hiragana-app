import { describe, it, expect } from 'vitest';
import { buildPathD } from './pathGeometry';

const base = { pathHeight: 1000, nodeHeight: 140, paddingBottom: 150 };

describe('buildPathD', () => {
  it('ステージが0個なら、開始点だけの道になる', () => {
    expect(buildPathD({ ...base, count: 0 })).toBe('M 50 1000');
  });

  it('ステージが2個なら、左右に振れる滑らかな曲線になる', () => {
    expect(buildPathD({ ...base, count: 2 })).toBe(
      'M 50 1000 C 50 890 20 890 20 780 C 20 710 80 710 80 640'
    );
  });

  it('曲線の数はステージの数と同じ', () => {
    const d = buildPathD({ ...base, pathHeight: 1790, count: 11 });
    expect(d.match(/C/g)).toHaveLength(11);
  });

  it('最後のステージの中心で終わる', () => {
    // 最後(index 4)の y = 1000 - 150 - 70 - 4 * 140 = 220、x は偶数番目なので 20
    expect(buildPathD({ ...base, count: 5 }).endsWith('20 220')).toBe(true);
  });

  it('ステージ数が増えても、開始点は下端の中央', () => {
    expect(buildPathD({ ...base, pathHeight: 2000, count: 12 }).startsWith('M 50 2000')).toBe(true);
  });

  it('goalY を渡すと、最後のステージから中央上のゴールまで道が延びる', () => {
    // 最後のステージ(index 1)は x=80, y=640。中間の y は (640 + 100) / 2 = 370
    expect(buildPathD({ ...base, count: 2, goalY: 100 })).toBe(
      'M 50 1000 C 50 890 20 890 20 780 C 20 710 80 710 80 640 C 80 370 50 370 50 100'
    );
  });

  it('goalY を渡さなければ、道はゴールまで延びない', () => {
    expect(buildPathD({ ...base, count: 2 }).endsWith('80 640')).toBe(true);
  });
});
