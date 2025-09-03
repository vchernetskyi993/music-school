import { expect, test } from 'vitest';
import { median } from './math';

test('calculate median for even array', () => {
  expect(median([1, 4, 7, 9])).toBe(5.5);
});

test('calculate median for odd array', () => {
  expect(median([5, 3, 1, 8, 90])).toBe(5);
});

test('calculate median for odd array', () => {
  expect(() => median([])).toThrow("Array can't be empty!'");
});
