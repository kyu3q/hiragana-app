// 文字の基本形状を定義
export const characterShapes = {
  // ひらがな
  'あ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.35 }, end: { x: 0.8, y: 0.35 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'い': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.6, y: 0.3 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'う': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'curve', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'え': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'お': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'か': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'き': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'く': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'け': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'こ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'さ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'し': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'す': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'せ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'そ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'た': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ち': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'つ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'て': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'と': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'な': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'に': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } }
    ]
  },
  'ぬ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'ね': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'の': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'は': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ひ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ふ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'へ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ほ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ま': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'み': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'む': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'め': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'も': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'や': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ゆ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.7, y: 0.3 } }
    ]
  },
  'よ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ら': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'り': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'る': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'れ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'ろ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } },
      { type: 'curve', start: { x: 0.7, y: 0.7 }, end: { x: 0.3, y: 0.7 } }
    ]
  },
  'わ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'を': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ん': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  // カタカナ
  'ア': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'イ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.3 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } }
    ]
  },
  'ウ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'エ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'オ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'カ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'キ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ク': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ケ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'コ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'サ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'シ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.5, y: 0.5 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ス': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'セ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ソ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.5 } }
    ]
  },
  'タ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'チ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ツ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'テ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ト': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ナ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ニ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ヌ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ネ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } }
    ]
  },
  'ノ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ハ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ヒ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'フ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ヘ': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ホ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'マ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ミ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ム': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'curve', start: { x: 0.5, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'メ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'モ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ヤ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'curve', start: { x: 0.3, y: 0.7 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ユ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ヨ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.5 }, end: { x: 0.8, y: 0.5 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ラ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'リ': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.7 } },
      { type: 'vertical', start: { x: 0.7, y: 0.2 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'ル': {
    strokes: [
      { type: 'vertical', start: { x: 0.3, y: 0.2 }, end: { x: 0.3, y: 0.5 } },
      { type: 'curve', start: { x: 0.3, y: 0.5 }, end: { x: 0.7, y: 0.7 } }
    ]
  },
  'レ': {
    strokes: [
      { type: 'vertical', start: { x: 0.5, y: 0.2 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ロ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.2, y: 0.3 }, end: { x: 0.2, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } },
      { type: 'vertical', start: { x: 0.8, y: 0.3 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ワ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } }
    ]
  },
  'ヲ': {
    strokes: [
      { type: 'horizontal', start: { x: 0.2, y: 0.3 }, end: { x: 0.8, y: 0.3 } },
      { type: 'vertical', start: { x: 0.5, y: 0.3 }, end: { x: 0.5, y: 0.7 } },
      { type: 'horizontal', start: { x: 0.2, y: 0.7 }, end: { x: 0.8, y: 0.7 } }
    ]
  },
  'ン': {
    strokes: [
      { type: 'curve', start: { x: 0.3, y: 0.3 }, end: { x: 0.7, y: 0.3 } },
      { type: 'curve', start: { x: 0.5, y: 0.5 }, end: { x: 0.7, y: 0.7 } }
    ]
  }
};

// ストロークタイプの定義
export const strokeTypes = {
  VERTICAL: 'vertical',
  HORIZONTAL: 'horizontal',
  CURVE: 'curve'
};

// 評価基準の設定
export const evaluationCriteria = {
  POSITION_WEIGHT: 0.7,
  LENGTH_WEIGHT: 0.3,
  EXCELLENT_THRESHOLD: 90,
  GOOD_THRESHOLD: 70,
  FAIR_THRESHOLD: 50,
  CELEBRATION_THRESHOLD: 60
}; 