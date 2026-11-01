import { describe, it, expect } from 'vitest';
import { noteToFrequency, parseNotes, totalBeats } from './notes';

describe('noteToFrequency', () => {
  it('A4 は 440Hz', () => {
    expect(noteToFrequency('A4')).toBeCloseTo(440, 2);
  });

  it('オクターブが1つ上がると、周波数は2倍になる', () => {
    expect(noteToFrequency('A5')).toBeCloseTo(880, 2);
    expect(noteToFrequency('C5') / noteToFrequency('C4')).toBeCloseTo(2, 5);
  });

  it('C4 は約 261.63Hz', () => {
    expect(noteToFrequency('C4')).toBeCloseTo(261.63, 2);
  });

  it('シャープ（#）とフラット（b）を扱える', () => {
    expect(noteToFrequency('F#4')).toBeCloseTo(369.99, 2);
    expect(noteToFrequency('Bb3')).toBeCloseTo(233.08, 2);
  });

  it('休符 R は null を返す', () => {
    expect(noteToFrequency('R')).toBeNull();
  });

  it('読めない音名は、音名を含むエラーにする', () => {
    expect(() => noteToFrequency('H9')).toThrow('H9');
  });
});

describe('parseNotes', () => {
  it('「音名:拍数」を空白で区切った文字列を、音の配列にする', () => {
    const notes = parseNotes('C5:1 R:0.5 E5:2');
    expect(notes.map((n) => [n.note, n.beats])).toEqual([
      ['C5', 1],
      ['R', 0.5],
      ['E5', 2],
    ]);
  });

  it('各音に周波数を付ける（休符は null）', () => {
    const [a, rest] = parseNotes('A4:1 R:1');
    expect(a.freq).toBeCloseTo(440, 2);
    expect(rest.freq).toBeNull();
  });

  it('拍数がない、または0以下の記述は、記述を含むエラーにする', () => {
    expect(() => parseNotes('C5')).toThrow('C5');
    expect(() => parseNotes('C5:0')).toThrow('C5:0');
  });
});

describe('totalBeats', () => {
  it('音の拍数の合計を返す', () => {
    expect(totalBeats(parseNotes('C5:1 R:0.5 E5:2'))).toBe(3.5);
  });
});
