import { describe, it, expect } from 'vitest';
import { BLOCK_STAGES, buildBricks, brickColor, pickItemType } from './blockStages';

describe('BLOCK_STAGES', () => {
  it('おもちゃばこ・こおりのしろ・うちゅうの3ステージがこの順で並ぶ', () => {
    expect(BLOCK_STAGES.map((s) => s.name)).toEqual(['おもちゃばこ', 'こおりのしろ', 'うちゅう']);
  });

  it('最初のステージは、今までのゲームと同じ値（5行8列・ボール速さ5・ライフ5）', () => {
    const s = BLOCK_STAGES[0];
    expect([s.rows, s.cols, s.ballSpeed, s.lives]).toEqual([5, 8, 5, 5]);
  });

  it('進むほど、ボールが速くなる', () => {
    for (let i = 1; i < BLOCK_STAGES.length; i++) {
      expect(BLOCK_STAGES[i].ballSpeed).toBeGreaterThan(BLOCK_STAGES[i - 1].ballSpeed);
    }
  });

  it('進むほど、ブロックの数が増える', () => {
    for (let i = 1; i < BLOCK_STAGES.length; i++) {
      const prev = BLOCK_STAGES[i - 1];
      const cur = BLOCK_STAGES[i];
      expect(cur.rows * cur.cols).toBeGreaterThan(prev.rows * prev.cols);
    }
  });

  it('進むほど、ライフが減る（ただし1以上）', () => {
    for (let i = 1; i < BLOCK_STAGES.length; i++) {
      expect(BLOCK_STAGES[i].lives).toBeLessThan(BLOCK_STAGES[i - 1].lives);
    }
    BLOCK_STAGES.forEach((s) => expect(s.lives).toBeGreaterThanOrEqual(1));
  });

  it('ボールの速さは、上限（12）より小さい', () => {
    BLOCK_STAGES.forEach((s) => expect(s.ballSpeed).toBeLessThan(12));
  });

  it('どのステージも、見た目の設定がそろっている', () => {
    BLOCK_STAGES.forEach((s) => {
      expect(s.theme.background).toBeTruthy();
      expect(s.theme.ballColor).toBeTruthy();
      expect(s.theme.textColor).toBeTruthy();
      expect(s.theme.kanjiColor).toBeTruthy();
      expect(s.theme.brickHue).toHaveProperty('start');
    });
  });

  it('最初のステージはブロックに絵文字がなく、あとのステージにはある', () => {
    expect(BLOCK_STAGES[0].theme.brickEmoji).toBeNull();
    BLOCK_STAGES.slice(1).forEach((s) => expect(s.theme.brickEmoji).toBeTruthy());
  });
});

describe('brickColor', () => {
  it('最初のステージは、今までの色（hsl(列×45, 70%, 60%)）と同じ', () => {
    expect(brickColor({ col: 2, hue: BLOCK_STAGES[0].theme.brickHue })).toBe('hsl(90, 70%, 60%)');
  });
});

describe('pickItemType', () => {
  it('r1 が 0.2 以上なら、アイテムなし', () => {
    expect(pickItemType(0.2, 0, 0)).toBeNull();
  });
  it('今までと同じ割合で、heart / wide / multi を選ぶ', () => {
    expect(pickItemType(0.1, 0.1, 0.9)).toBe('heart');
    expect(pickItemType(0.1, 0.5, 0.3)).toBe('wide');
    expect(pickItemType(0.1, 0.5, 0.7)).toBe('multi');
  });
});

describe('buildBricks', () => {
  const base = { width: 800, padding: 10, offsetTop: 60, offsetLeft: 30, offsetRight: 30, brickHeight: 30 };

  it('行数×列数のブロックができる', () => {
    BLOCK_STAGES.forEach((s) => {
      const bricks = buildBricks({ ...base, stage: s, random: () => 0.5 });
      expect(bricks).toHaveLength(s.rows * s.cols);
    });
  });

  it('最初のステージの配置は、今までと同じ（幅84.25・先頭が(30,60)）', () => {
    const bricks = buildBricks({ ...base, stage: BLOCK_STAGES[0], random: () => 0.5 });
    expect(bricks[0]).toMatchObject({ x: 30, y: 60, height: 30, status: 1 });
    expect(bricks[0].width).toBeCloseTo((740 - 70) / 8, 10);
  });

  it('どのステージも、ブロックが画面の左右からはみ出さない', () => {
    BLOCK_STAGES.forEach((s) => {
      const bricks = buildBricks({ ...base, stage: s, random: () => 0.5 });
      bricks.forEach((b) => {
        expect(b.x).toBeGreaterThanOrEqual(30);
        expect(b.x + b.width).toBeLessThanOrEqual(770 + 1e-9);
      });
    });
  });

  it('どのステージも、一番下の段がパドル（高さ580）より十分に上にある', () => {
    BLOCK_STAGES.forEach((s) => {
      const bricks = buildBricks({ ...base, stage: s, random: () => 0.5 });
      const bottom = Math.max(...bricks.map((b) => b.y + b.height));
      expect(bottom).toBeLessThan(450);
    });
  });

  it('乱数が決まれば、アイテムも決まる（0.1 なら heart、0.9 ならなし）', () => {
    const withItem = buildBricks({ ...base, stage: BLOCK_STAGES[0], random: () => 0.1 });
    expect(withItem[0].itemType).toBe('heart');
    const none = buildBricks({ ...base, stage: BLOCK_STAGES[0], random: () => 0.9 });
    expect(none[0].itemType).toBeNull();
  });
});
