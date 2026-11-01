import { describe, it, expect } from 'vitest';
import { BGM_TRACK_IDS, getTrack } from './bgmTracks';

describe('BGM_TRACK_IDS', () => {
  it('漢字カードの6つのゲームそれぞれに曲がある', () => {
    expect([...BGM_TRACK_IDS].sort()).toEqual(['airplane', 'battle', 'block', 'catch', 'jump', 'snake']);
  });
});

describe.each(BGM_TRACK_IDS)('曲「%s」', (id) => {
  const track = getTrack(id);

  it('テンポが現実的な範囲にある', () => {
    expect(track.tempo).toBeGreaterThanOrEqual(80);
    expect(track.tempo).toBeLessThanOrEqual(200);
  });

  it('メロディと伴奏など、2つ以上のパートがある', () => {
    expect(track.voices.length).toBeGreaterThanOrEqual(2);
  });

  it('すべてのパートの長さが同じで、ループしてもずれない', () => {
    const lengths = track.voices.map((v) => v.beats);
    expect(new Set(lengths).size).toBe(1);
  });

  it('1ループは16拍以上ある', () => {
    expect(track.beats).toBeGreaterThanOrEqual(16);
  });

  it('音量とすべての音の高さが、聞き取れる範囲にある', () => {
    track.voices.forEach((voice) => {
      expect(voice.gain).toBeGreaterThan(0);
      expect(voice.gain).toBeLessThanOrEqual(0.3);
      voice.notes.forEach((n) => {
        if (n.freq !== null) {
          expect(n.freq).toBeGreaterThan(40);
          expect(n.freq).toBeLessThan(4200);
        }
      });
    });
  });
});

describe('曲どうしの違い', () => {
  it('ゲームごとにメロディが違う', () => {
    const melodies = BGM_TRACK_IDS.map((id) => getTrack(id).voices[0].notes.map((n) => `${n.note}:${n.beats}`).join(' '));
    expect(new Set(melodies).size).toBe(BGM_TRACK_IDS.length);
  });

  it('ゲームごとにテンポが違う', () => {
    const tempos = BGM_TRACK_IDS.map((id) => getTrack(id).tempo);
    expect(new Set(tempos).size).toBe(BGM_TRACK_IDS.length);
  });
});

describe('getTrack', () => {
  it('知らない曲名は、曲名を含むエラーにする', () => {
    expect(() => getTrack('unknown')).toThrow('unknown');
  });
});
