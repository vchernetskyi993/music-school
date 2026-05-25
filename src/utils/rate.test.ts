import { expect, test } from 'vitest';
import { calculateCountPerMinute, formatCountPerMinute } from './rate';

test('returns zero when no time has elapsed', () => {
  expect(calculateCountPerMinute(0, 0)).toBe(0);
  expect(calculateCountPerMinute(5, 0)).toBe(0);
});

test('calculates count per minute for exact rates', () => {
  expect(calculateCountPerMinute(1, 60)).toBe(1);
  expect(calculateCountPerMinute(5, 60)).toBe(5);
  expect(calculateCountPerMinute(2, 30)).toBe(4);
  expect(calculateCountPerMinute(15, 180)).toBe(5);
});

test('rounds fractional counts per minute to two decimal places', () => {
  expect(calculateCountPerMinute(1, 45)).toBe(1.33);
  expect(calculateCountPerMinute(1, 20)).toBe(3);
  expect(calculateCountPerMinute(7, 90)).toBe(4.67);
});

test('formats count per minute with exactly two decimal places', () => {
  expect(formatCountPerMinute(0, 0)).toBe('0.00');
  expect(formatCountPerMinute(1, 60)).toBe('1.00');
  expect(formatCountPerMinute(1, 45)).toBe('1.33');
  expect(formatCountPerMinute(7, 90)).toBe('4.67');
});

test('rejects invalid counts', () => {
  expect(() => calculateCountPerMinute(-1, 60)).toThrow('Count cannot be negative');
  expect(() => calculateCountPerMinute(1.5, 60)).toThrow('Count must be an integer');
  expect(() => calculateCountPerMinute(Number.NaN, 60)).toThrow('Count must be an integer');
  expect(() => calculateCountPerMinute(Number.POSITIVE_INFINITY, 60)).toThrow(
    'Count must be an integer'
  );
  expect(() => formatCountPerMinute(-1, 60)).toThrow('Count cannot be negative');
});

test('rejects invalid durations', () => {
  expect(() => calculateCountPerMinute(1, -1)).toThrow('Duration cannot be negative');
  expect(() => calculateCountPerMinute(1, 1.5)).toThrow(
    'Duration must be an integer number of seconds'
  );
  expect(() => calculateCountPerMinute(1, Number.NaN)).toThrow(
    'Duration must be an integer number of seconds'
  );
  expect(() => calculateCountPerMinute(1, Number.POSITIVE_INFINITY)).toThrow(
    'Duration must be an integer number of seconds'
  );
});
