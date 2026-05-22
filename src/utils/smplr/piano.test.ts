import { expect, test } from 'vitest';
import { nearestSplendidGrandPianoSampleMidi } from './piano';

test('maps a MIDI note to an exact splendid grand piano sample', () => {
  expect(nearestSplendidGrandPianoSampleMidi(60)).toBe(60);
});

test('maps a MIDI note to the nearest splendid grand piano sample', () => {
  expect(nearestSplendidGrandPianoSampleMidi(61)).toBe(62);
});
