import { expect, test } from 'vitest';
import { enumerateIntervals, frequencyDiff, nextNote } from './music';

test('get next note', () => {
  expect(nextNote('E2')).toBe('F2');
});

test('calculate frequency difference', () => {
  expect(frequencyDiff('E2', 'F2')).toBe(4.9);
});

test('enumerate intervals', () => {
  const actual = enumerateIntervals(['E2', 'F2', 'F#2']);
  const expected = [
    { note: 'E2', interval: 'm2' },
    { note: 'E2', interval: 'M2' },
    { note: 'F2', interval: 'A1' },
  ];

  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
});

test('enumerate intervals for non consecutive notes', () => {
  const actual = enumerateIntervals(['E2', 'G2', 'B2', 'E3']);
  const expected = [
    { note: 'E2', interval: 'm3' },
    { note: 'E2', interval: 'P5' },
    { note: 'E2', interval: 'P8' },
    { note: 'G2', interval: 'M3' },
    { note: 'G2', interval: 'M6' },
    { note: 'B2', interval: 'P4' },
  ];

  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
});

test('enumerate intervals limiting to single octave', () => {
  const actual = enumerateIntervals(['E2', 'B2', 'F#3']);
  const expected = [
    { note: 'E2', interval: 'P5' },
    { note: 'B2', interval: 'P5' },
  ];
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
});
