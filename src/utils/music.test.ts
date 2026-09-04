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
    { from: 'E2', to: 'F2' },
    { from: 'E2', to: 'F#2' },
    { from: 'F2', to: 'F#2' },
  ];

  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
});

test('enumerate intervals for non consecutive notes', () => {
  const actual = enumerateIntervals(['E2', 'G2', 'B2', 'E3']);
  const expected = [
    { from: 'E2', to: 'G2' },
    { from: 'E2', to: 'B2' },
    { from: 'E2', to: 'E3' },
    { from: 'G2', to: 'B2' },
    { from: 'G2', to: 'E3' },
    { from: 'B2', to: 'E3' },
  ];

  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
});

test('enumerate intervals limiting to single octave', () => {
  const actual = enumerateIntervals(['E2', 'B2', 'F#3']);
  const expected = [
    { from: 'E2', to: 'B2' },
    { from: 'B2', to: 'F#3' },
  ];
  expect(actual).toHaveLength(expected.length);
  expect(actual).toEqual(expect.arrayContaining(expected));
});
