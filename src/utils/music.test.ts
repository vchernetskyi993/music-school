import { expect, test } from 'vitest';
import { frequencyDiff, nextNote, spnToMidi } from './music';

test('get next note', () => {
  expect(nextNote('E2')).toBe('F2');
});

test('calculate frequency difference', () => {
  expect(frequencyDiff('E2', 'F2')).toBe(4.9);
});

test('converts SPN notes to MIDI', () => {
  expect(spnToMidi('C4')).toBe(60);
  expect(spnToMidi('F#3')).toBe(54);
  expect(spnToMidi('Bb4')).toBe(70);
});

test('converts enharmonic SPN notes to the same MIDI note', () => {
  expect(spnToMidi('Bb3')).toBe(spnToMidi('A#3'));
});
