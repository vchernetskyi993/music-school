import { expect, test } from 'vitest';
import { frequencyDiff, nextNote } from './music';

test('get next note', () => {
  expect(nextNote('E2')).toBe('F2');
});

test('calculate frequency difference', () => {
  expect(frequencyDiff('E2', 'F2')).toBe(4.9);
});
